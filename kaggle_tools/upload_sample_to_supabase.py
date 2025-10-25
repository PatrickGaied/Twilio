import sqlite3
import requests
import json
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Supabase configuration from .env
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_ANON_KEY = os.getenv('SUPABASE_ANON_KEY')

def create_table_via_api():
    """Create table using Supabase REST API"""
    # Note: Table creation requires service role key, not anon key
    # For now, we'll assume the table exists or create it via dashboard
    print("Please ensure the 'ecommerce_events' table exists in your Supabase dashboard")
    print("Table schema should include:")
    print("  - event_time (timestamp)")
    print("  - event_type (text)")
    print("  - product_id (bigint)")
    print("  - category_id (bigint)")
    print("  - category_code (text)")
    print("  - brand (text)")
    print("  - price (numeric)")
    print("  - user_id (bigint)")
    print("  - user_session (text)")

def upload_all_data():
    """Upload ALL data to Supabase using REST API"""

    # Connect to SQLite
    conn = sqlite3.connect('ecommerce.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    # Get table names
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [row[0] for row in cursor.fetchall()]

    if not tables:
        print("No tables found in SQLite database")
        return

    total_rows_uploaded = 0

    # Upload data from ALL tables
    for table_name in tables:
        print(f"\n{'='*60}")
        print(f"Uploading from table: {table_name}")
        print('='*60)

        # Get total count for this table
        cursor.execute(f'SELECT COUNT(*) FROM "{table_name}"')
        table_total = cursor.fetchone()[0]
        print(f"Total rows in {table_name}: {table_total:,}")

        # Process in chunks to manage memory
        chunk_size = 100000  # Process 100k rows at a time
        offset = 0

        while True:
            # Get chunk of data
            cursor.execute(f'''
                SELECT event_time, event_type, product_id, category_id,
                       category_code, brand, price, user_id, user_session
                FROM "{table_name}"
                LIMIT {chunk_size} OFFSET {offset}
            ''')

            rows = cursor.fetchall()
            if not rows:
                break

            print(f"\nProcessing rows {offset:,} to {offset + len(rows):,} from {table_name}")

            # Prepare data for upload
            batch_size = 1000
            table_uploaded = 0

            headers = {
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
                "Content-Type": "application/json",
                "Prefer": "return=minimal"  # Don't return inserted rows to save bandwidth
            }

            for i in range(0, len(rows), batch_size):
                batch = rows[i:i+batch_size]

                # Convert to JSON-serializable format
                json_data = []
                for row in batch:
                    # Parse event_time
                    try:
                        if row['event_time']:
                            # Handle the UTC format from the CSV
                            event_time = row['event_time'].replace(' UTC', '')
                            # Convert to ISO format for Supabase
                            dt = datetime.strptime(event_time, '%Y-%m-%d %H:%M:%S')
                            event_time_iso = dt.isoformat()
                        else:
                            event_time_iso = None
                    except:
                        event_time_iso = None

                    json_data.append({
                        "event_time": event_time_iso,
                        "event_type": row['event_type'],
                        "product_id": row['product_id'],
                        "category_id": row['category_id'],
                        "category_code": row['category_code'],
                        "brand": row['brand'],
                        "price": float(row['price']) if row['price'] else None,
                        "user_id": row['user_id'],
                        "user_session": row['user_session']
                    })

                # Upload batch via REST API
                try:
                    response = requests.post(
                        f"{SUPABASE_URL}/rest/v1/ecommerce_events",
                        headers=headers,
                        json=json_data
                    )

                    if response.status_code == 201:
                        table_uploaded += len(batch)
                        chunk_progress = (table_uploaded / len(rows)) * 100
                        overall_progress = ((offset + table_uploaded) / table_total) * 100
                        print(f"Chunk: {table_uploaded:,}/{len(rows):,} ({chunk_progress:.1f}%) | Overall: {offset + table_uploaded:,}/{table_total:,} ({overall_progress:.1f}%)", end='\r')
                    else:
                        print(f"\nError uploading batch: {response.status_code}")
                        print(f"Response: {response.text}")
                        break

                except Exception as e:
                    print(f"\nError: {e}")
                    break

            offset += chunk_size
            total_rows_uploaded += table_uploaded
            print(f"\n✓ Completed chunk: {table_uploaded:,} rows uploaded")

        print(f"\n{'='*60}")
        print(f"✓ Finished uploading table {table_name}")
        print(f"{'='*60}")

    # Final summary
    print(f"\n{'='*80}")
    print(f"UPLOAD COMPLETE")
    print(f"{'='*80}")
    print(f"Total rows uploaded across all tables: {total_rows_uploaded:,}")

    # Verify upload
    try:
        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/ecommerce_events?select=count",
            headers={
                "apikey": SUPABASE_ANON_KEY,
                "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
            }
        )

        if response.status_code == 200:
            data = response.json()
            if data and len(data) > 0:
                print(f"✓ Verified: Table now contains {data[0]['count']:,} total rows in Supabase")
    except Exception as e:
        print(f"Could not verify count: {e}")

    conn.close()

def main():
    print("=" * 80)
    print("Supabase FULL Data Upload (100GB Plan)")
    print("=" * 80)

    # Test API connection first
    print("\n1. Testing Supabase API connection...")

    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
    }

    try:
        # Try to get tables
        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/",
            headers=headers
        )

        if response.status_code == 200:
            print("✓ Successfully connected to Supabase API")
            available_tables = response.json()
            print(f"Available tables/views: {available_tables}")
        else:
            print(f"API responded with status: {response.status_code}")

    except Exception as e:
        print(f"Error connecting to API: {e}")
        return

    # Check if table exists
    print("\n2. Checking for ecommerce_events table...")
    response = requests.get(
        f"{SUPABASE_URL}/rest/v1/ecommerce_events?limit=1",
        headers=headers
    )

    if response.status_code == 404:
        print("✗ Table 'ecommerce_events' doesn't exist")
        print("\nPlease create the table in Supabase dashboard first:")
        print("1. Go to Table Editor")
        print("2. Create new table 'ecommerce_events'")
        print("3. Add columns as shown above")
        create_table_via_api()
        return
    elif response.status_code == 200:
        print("✓ Table 'ecommerce_events' exists")

    # Upload ALL data
    print("\n3. Starting FULL database upload (~67.5 million rows)...")
    print("This will upload ALL data from your SQLite database.")
    print("With ~67.5M rows, this may take several hours.")
    print("\n" + "=" * 80)

    upload_all_data()

    print("\n" + "=" * 80)
    print("✓ Upload completed!")
    print("=" * 80)

if __name__ == "__main__":
    main()