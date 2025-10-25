# Kaggle E-commerce Data Tools

Tools for processing and uploading Kaggle e-commerce behavior data.

## Files

- `load_ecommerce_to_sqlite.py` - Load CSV data from Kaggle cache to SQLite
- `upload_sample_to_supabase.py` - Upload data to Supabase database
- `query_supabase.py` - Query and test Supabase data
- `customer_insights_for_messaging.py` - Extract customer insights for messaging platforms

## Usage

1. **Load Kaggle data to SQLite:**
   ```bash
   python load_ecommerce_to_sqlite.py
   ```

2. **Upload to Supabase:**
   ```bash
   python upload_sample_to_supabase.py
   ```

3. **Query Supabase data:**
   ```bash
   python query_supabase.py
   ```

4. **Generate customer insights:**
   ```bash
   python customer_insights_for_messaging.py
   ```

## Data Source

The tools expect Kaggle e-commerce data in the cache at:
`~/.cache/kagglehub/datasets/mkechinov/ecommerce-behavior-data-from-multi-category-store/versions/8/`

Contains files:
- `2019-Nov.csv` (~67M rows)
- `2019-Oct.csv` (~42M rows)

## Environment Variables

Set in `.env` file:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```