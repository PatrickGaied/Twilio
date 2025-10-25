
import random
import chromadb

### Postgress part ### 

import requests
import json
from datetime import datetime
import pandas as pd

import chromadb
from chromadb.config import DEFAULT_TENANT, DEFAULT_DATABASE, Settings
 
# Supabase configuration
SUPABASE_URL = "https://grqhfzpwnehggpeclagk.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycWhmenB3bmVoZ2dwZWNsYWdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNDI3MDksImV4cCI6MjA3NjkxODcwOX0.MrfkQ_qHYNUAT2_G-NXtYgf2KBEVWlWeyOWwe5NwuVs"

row_count = 4_500_000
empty_df = pd.DataFrame()

def query_rows() -> pd.DataFrame: 
    
    print("\nQuerying ecomerce data...")
    
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
    }

    # Query first 5 rows ordered by event_time
    params = {
        "select": "*",
        "order": "event_time.asc",
        "limit": row_count
    }

    try:
        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/ecommerce_events",
            headers=headers,
            params=params
        )

        if response.status_code == 404:
            print("Table 'ecommerce_events' not found.")
            return empty_df

        if response.status_code == 200:
            data = response.json()

            if len(data) == 0:
                print("No data found in the table.")
                return empty_df
 
            return pd.DataFrame(data)
            
        else:
            print(f"Error querying data: Status {response.status_code}")
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"Error: {e}")
        return empty_df

def get_table_stats() -> None: # Not using rn 
    
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
        "Prefer": "count=exact"
    }

    try:
        # Get total count
        response = requests.head(
            f"{SUPABASE_URL}/rest/v1/ecommerce_events",
            headers=headers
        )

        if response.status_code == 200:
            content_range = response.headers.get('content-range', '')
            if content_range:
                # Parse count from content-range header (format: "0-0/total")
                total = content_range.split('/')[-1]
                print(f"\nTable Statistics:")
                print(f"  Total rows: {total}")

        # Get event type distribution (limited query)
        params = {
            "select": "event_type",
            "limit": "1000"
        }

        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/ecommerce_events",
            headers={"apikey": SUPABASE_ANON_KEY, "Authorization": f"Bearer {SUPABASE_ANON_KEY}"},
            params=params
        )

        if response.status_code == 200:
            data = response.json()
            if data:
                df = pd.DataFrame(data)
                event_counts = df['event_type'].value_counts()
                print(f"\n  Event type distribution (sample of 1000):")
                for event_type, count in event_counts.items():
                    print(f"    {event_type}: {count}")

    except Exception as e:
        print(f"Error getting stats: {e}")

def connect_supabase() -> bool: 
    print("\nConnecting to Supabase...")

    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
    }

    try:
        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/",
            headers=headers
        )

        if response.status_code == 200:
            pass
        else:
            print(f"Connection failed: Status {response.status_code} - No big booms :(")
            return False

    except Exception as e:
        print(f"Connection error: {e} - No big booms :(")
        return False

    return True



def main() -> None:
       
    [print("Connected to supabase") if connect_supabase() else print("Failed to connect to supabase")]
 
    # Query first 5 rows
    df = query_rows()
    
    # chroma_client = chromadb.Client()

    chroma_client = chromadb.PersistentClient(
        path="chromadb",
        settings=Settings(),
        tenant=DEFAULT_TENANT,
        database=DEFAULT_DATABASE,
    )
    
    print("Adding category codes to collection...")
    
    # Clean entries but keep original index:
    category_codes = {
        str(index): category_code for index, category_code in enumerate(set(df['category_code'])) if category_code != None
    }
    
    # print(category_codes)
    
    collection = chroma_client.create_collection(name="ecomerce_events")
    collection.add(
        ids=list(category_codes.keys()),
        documents=list(category_codes.values())
    )
    
    example_query = "smart phone"
    print(f"Example results for {example_query}:\n")
    # Random query for testing:
    results = collection.query(
        query_texts=[example_query],  # list(random.choice(list(category_codes.values()))), # Chroma will embed this
        n_results=5 # how many results to return
        
    )
    print(results)

if __name__ == "__main__":
    main()