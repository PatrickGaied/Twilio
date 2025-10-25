from fastapi import FastAPI, Depends, HTTPException, Header, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
import os

from chromadb import PersistentClient
from chromadb.utils import embedding_functions

from supabase import create_client, Client

API_KEY = os.getenv("INSIGHTS_API_KEY", "devkey")
CHROMA_PATH = os.getenv("CHROMA_PATH", "./.chroma")
CHROMA_COLLECTION = os.getenv("CHROMA_COLLECTION", "events_vectors")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

def require_key(authorization: Optional[str] = Header(None)):
    if not API_KEY:
        return
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(401, "missing bearer token")
    token = authorization.split(" ", 1)[1]
    if token != API_KEY:
        raise HTTPException(403, "invalid token")

app = FastAPI(title="E‑Commerce Insights API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in prod
    allow_methods=["*"],
    allow_headers=["*"],
)

client = PersistentClient(path=CHROMA_PATH)
embed = embedding_functions.DefaultEmbeddingFunction()
coll = client.get_or_create_collection(CHROMA_COLLECTION, embedding_function=embed)

sb: Optional[Client] = None
if SUPABASE_URL and SUPABASE_SERVICE_KEY:
    sb = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

class SearchIn(BaseModel):
    q: str
    k: int = 12
    domain: Optional[str] = None
    brand: Optional[str] = None
    category_code: Optional[str] = None
    date_from: Optional[str] = None  # YYYY-MM-DD
    date_to: Optional[str] = None

def make_where(domain: Optional[str], brand: Optional[str], category: Optional[str], date_from: Optional[str], date_to: Optional[str]):
    where: Dict[str, Any] = {}
    if domain and domain != "all":
        where["event_type"] = {"$eq": domain} if domain in ["view","cart","remove_from_cart","purchase"] else {"$eq": domain}
        # Note: if you use "domain" instead of event_type, swap key here
    if brand:
        where["brand"] = {"$contains": brand}
    if category:
        where["category_code"] = {"$contains": category}
    if date_from or date_to:
        # requires you stored ts_day in metadata at ingest time
        rng = {}
        if date_from: rng["$gte"] = date_from
        if date_to: rng["$lte"] = date_to
        where["ts_day"] = rng
    return where


def fetch_all(where: Dict[str, Any], cap: int = 15000, batch: int = 2000, include_docs: bool = False):
    include = ["metadatas"] + (["documents"] if include_docs else [])
    out = []
    offset = 0
    while offset < cap:
        res = coll.get(where=where, limit=batch, offset=offset, include=include)
        metas = res.get("metadatas", []) or []
        docs = res.get("documents", []) or []
        if not metas:
            break
        for i, m in enumerate(metas):
            m = m or {}
            if include_docs:
                m["_doc"] = docs[i] if i < len(docs) else ""
            out.append(m)
        if len(metas) < batch:
            break
        offset += batch
    return out


def buckets_by_day(rows):
    b: Dict[str, Dict[str, float]] = {}
    for r in rows:
        d = str(r.get("ts_day") or "") or "unknown"
        if d not in b:
            b[d] = {"date": d, "view": 0, "cart": 0, "remove_from_cart": 0, "purchase": 0, "revenue": 0.0}
        et = str(r.get("event_type") or r.get("domain") or "view")
        if et in b[d]:
            b[d][et] += 1
        if et == "purchase":
            try:
                b[d]["revenue"] += float(r.get("price") or 0)
            except:
                pass
    return sorted(b.values(), key=lambda x: x["date"])

# ============ ROUTES ============

@app.get("/health")
def health():
    return {"ok": True}

@app.post("/search", dependencies=[Depends(require_key)])
def search(body: SearchIn):
    where = make_where(None, body.brand, body.category_code, body.date_from, body.date_to)
    if body.domain and body.domain != "all":
        # use event_type as the domain filter per your CSV
        where["event_type"] = {"$eq": body.domain}
    res = coll.query(query_texts=[body.q], n_results=body.k, where=where)
    docs = res.get("documents", [[]])[0]
    metas = res.get("metadatas", [[]])[0]
    dists = res.get("distances", [[]])[0]
    return {"results": [
        {"doc": d, "meta": m, "score": float(s)} for d, m, s in zip(docs, metas, dists)
    ]}

@app.get("/insights/funnel", dependencies=[Depends(require_key)])
def funnel(date_from: Optional[str] = None, date_to: Optional[str] = None, brand: Optional[str] = None, category_code: Optional[str] = None):
    where = make_where(None, brand, category_code, date_from, date_to)
    rows = fetch_all(where, cap=15000)
    V = sum(1 for r in rows if r.get("event_type") == "view")
    C = sum(1 for r in rows if r.get("event_type") == "cart")
    R = sum(1 for r in rows if r.get("event_type") == "remove_from_cart")
    P = sum(1 for r in rows if r.get("event_type") == "purchase")
    revenue = round(sum(float(r.get("price") or 0.0) for r in rows if r.get("event_type") == "purchase"), 2)
    conv = round((P / V * 100.0), 2) if V else 0.0
    abandon = round((R / C * 100.0), 2) if C else 0.0
    return {"view": V, "cart": C, "remove_from_cart": R, "purchase": P, "conversion_pct": conv, "cart_abandon_pct": abandon, "revenue": revenue}

@app.get("/insights/timeseries", dependencies=[Depends(require_key)])
def timeseries(date_from: Optional[str] = None, date_to: Optional[str] = None, brand: Optional[str] = None, category_code: Optional[str] = None):
    where = make_where(None, brand, category_code, date_from, date_to)
    rows = fetch_all(where, cap=15000)
    return {"series": buckets_by_day(rows)}

@app.get("/insights/top", dependencies=[Depends(require_key)])
def top(field: str = Query("brand", pattern="^(brand|category_code)$"), n: int = 10, date_from: Optional[str] = None, date_to: Optional[str] = None):
    where = make_where(None, None, None, date_from, date_to)
    rows = fetch_all(where, cap=15000)
    counts: Dict[str, int] = {}
    for r in rows:
        v = str(r.get(field) or "Unknown")
        counts[v] = counts.get(v, 0) + 1
    ranked = sorted([{"name": k, "count": v} for k, v in counts.items()], key=lambda x: -x["count"])[:n]
    return {"field": field, "items": ranked}

@app.get("/events", dependencies=[Depends(require_key)])
def events(limit: int = 500, offset: int = 0, date_from: Optional[str] = None, date_to: Optional[str] = None, event_type: Optional[str] = None, brand: Optional[str] = None, category_code: Optional[str] = None):
    """Optional: proxy Supabase for table view; falls back to Chroma if Supabase not set."""
    if sb:
        q = sb.from_("events").select("*").order("event_time", desc=True).range(offset, offset + limit - 1)
        if date_from: q = q.gte("event_time", f"{date_from}T00:00:00Z")
        if date_to: q = q.lte("event_time", f"{date_to}T23:59:59Z")
        if event_type and event_type != "all": q = q.eq("event_type", event_type)
        if brand: q = q.ilike("brand", f"%{brand}%")
        if category_code: q = q.ilike("category_code", f"%{category_code}%")
        data = q.execute().data or []
        return {"rows": data, "limit": limit, "offset": offset}
    # fallback: Chroma-only (metadatas)
    where = make_where(event_type, brand, category_code, date_from, date_to)
    rows = fetch_all(where, cap=limit + offset)
    rows = rows[offset: offset + limit]
    return {"rows": rows, "limit": limit, "offset": offset}

