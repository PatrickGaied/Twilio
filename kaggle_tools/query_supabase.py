import requests
import json
from datetime import datetime
import pandas as pd
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Supabase configuration from .env
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_ANON_KEY = os.getenv('SUPABASE_ANON_KEY')

def query_first_5_rows():
    """Query the first 5 rows from ecommerce_events table"""

    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
    }

    # Query first 5 rows ordered by event_time
    params = {
        "select": "*",
        "order": "event_time.asc",
        "limit": "5"
    }

    try:
        response = requests.get(
            f"{SUPABASE_URL}/rest/v1/ecommerce_events",
            headers=headers,
            params=params
        )

        if response.status_code == 200:
            data = response.json()

            if len(data) == 0:
                print("No data found in the table.")
                return

            print("First 5 rows from ecommerce_events table:")
            print("=" * 80)

            # Convert to DataFrame for better display
            df = pd.DataFrame(data)

            # Display each row in a readable format
            for idx, row in df.iterrows():
                print(f"\nRow {idx + 1}:")
                print("-" * 40)
                for col in df.columns:
                    value = row[col]
                    # Format timestamp for readability
                    if col == 'event_time' and value:
                        try:
                            dt = datetime.fromisoformat(value.replace('Z', '+00:00'))
                            value = dt.strftime('%Y-%m-%d %H:%M:%S')
                        except:
                            pass
                    print(f"  {col}: {value}")

            print("\n" + "=" * 80)
            print(f"Total rows fetched: {len(data)}")

            # Also show as table
            print("\nTable view:")
            print(df.to_string(index=False))

        elif response.status_code == 404:
            print("Table 'ecommerce_events' not found.")
            print("Please create the table first using the SQL script.")
        else:
            print(f"Error querying data: Status {response.status_code}")
            print(f"Response: {response.text}")

    except Exception as e:
        print(f"Error: {e}")

def get_table_stats():
    """Get statistics about the table"""

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

def main():
    print("=" * 80)
    print("Supabase Query - First 5 Rows")
    print("=" * 80)

    # Test connection
    print("\nTesting connection to Supabase...")

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
            print("✓ Connected to Supabase successfully")
        else:
            print(f"✗ Connection failed: Status {response.status_code}")
            return

    except Exception as e:
        print(f"✗ Connection error: {e}")
        return

    # Query first 5 rows
    print("\nQuerying data...")
    query_first_5_rows()

    # Get table statistics
    get_table_stats()

if __name__ == "__main__":
    main()