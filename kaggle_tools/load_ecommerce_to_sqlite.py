import sqlite3
import pandas as pd
import os
from pathlib import Path

def load_csv_to_sqlite(csv_path, db_path='ecommerce.db', table_name='events'):
    """Load CSV file into SQLite database"""

    # Connect to SQLite database (creates if doesn't exist)
    conn = sqlite3.connect(db_path)

    try:
        # Read CSV in chunks to handle large files
        chunk_size = 100000

        print(f"Loading {csv_path} into SQLite database...")

        # Read first chunk to get column names and create table
        first_chunk = pd.read_csv(csv_path, nrows=1)
        columns = first_chunk.columns.tolist()
        print(f"Columns found: {columns}")

        # Process file in chunks
        for i, chunk in enumerate(pd.read_csv(csv_path, chunksize=chunk_size)):
            # Write to SQLite (replace on first chunk, append on subsequent)
            if i == 0:
                chunk.to_sql(table_name, conn, if_exists='replace', index=False)
                print(f"Created table '{table_name}' and inserted first {len(chunk)} rows")
            else:
                chunk.to_sql(table_name, conn, if_exists='append', index=False)
                print(f"Inserted chunk {i+1} ({len(chunk)} rows)")

        # Create indexes for better query performance
        print("Creating indexes...")
        cursor = conn.cursor()
        cursor.execute(f'CREATE INDEX IF NOT EXISTS idx_event_time ON "{table_name}"(event_time)')
        cursor.execute(f'CREATE INDEX IF NOT EXISTS idx_user_id ON "{table_name}"(user_id)')
        cursor.execute(f'CREATE INDEX IF NOT EXISTS idx_product_id ON "{table_name}"(product_id)')
        cursor.execute(f'CREATE INDEX IF NOT EXISTS idx_event_type ON "{table_name}"(event_type)')
        conn.commit()

        # Get row count
        cursor.execute(f'SELECT COUNT(*) FROM "{table_name}"')
        row_count = cursor.fetchone()[0]
        print(f"\nSuccessfully loaded {row_count:,} rows into '{table_name}' table")

    finally:
        conn.close()

def main():
    # Path to Kaggle dataset cache
    kaggle_cache = Path.home() / '.cache' / 'kagglehub' / 'datasets' / 'mkechinov' / 'ecommerce-behavior-data-from-multi-category-store' / 'versions' / '8'

    if not kaggle_cache.exists():
        print(f"Error: Kaggle cache directory not found at {kaggle_cache}")
        return

    # Find CSV files
    csv_files = list(kaggle_cache.glob('*.csv'))

    if not csv_files:
        print(f"No CSV files found in {kaggle_cache}")
        return

    print(f"Found {len(csv_files)} CSV file(s):")
    for csv_file in csv_files:
        print(f"  - {csv_file.name}")

    # Load each CSV file
    for csv_file in sorted(csv_files):
        print(f"\n{'='*50}")
        print(f"Processing: {csv_file.name}")
        print(f"{'='*50}")

        # Use different table names for different months
        table_name = csv_file.stem.replace('-', '_').lower()
        load_csv_to_sqlite(csv_file, table_name=table_name)

    print("\n✓ All files loaded successfully!")
    print(f"Database created: ecommerce.db")

if __name__ == "__main__":
    main()