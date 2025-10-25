import requests
import pandas as pd
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_ANON_KEY = os.getenv('SUPABASE_ANON_KEY')

def fetch_data(query_params):
    """Fetch data from Supabase"""
    headers = {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
    }

    response = requests.get(
        f"{SUPABASE_URL}/rest/v1/ecommerce_events",
        headers=headers,
        params=query_params
    )

    if response.status_code == 200:
        return response.json()
    return []

def get_messaging_insights():
    """Extract insights relevant for a Twilio-like messaging platform"""

    print("=" * 80)
    print("CUSTOMER INSIGHTS FOR MESSAGING PLATFORM")
    print("=" * 80)

    # 1. USER ENGAGEMENT PATTERNS
    print("\n1. USER ENGAGEMENT PATTERNS (for optimal message timing)")
    print("-" * 60)

    # Get hourly activity patterns
    sample_data = fetch_data({
        "select": "event_time,user_id,event_type",
        "limit": "10000"
    })

    if sample_data:
        df = pd.DataFrame(sample_data)
        df['event_time'] = pd.to_datetime(df['event_time'])
        df['hour'] = df['event_time'].dt.hour
        df['day_of_week'] = df['event_time'].dt.dayofweek

        # Peak hours analysis
        hourly_activity = df.groupby('hour').size()
        peak_hours = hourly_activity.nlargest(5)

        print("\n📊 Peak Activity Hours (Best time to send messages):")
        for hour, count in peak_hours.items():
            print(f"   {hour:02d}:00 - {(count/len(df)*100):.1f}% of activity")

        # Day of week patterns
        days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        daily_activity = df.groupby('day_of_week').size()

        print("\n📅 Activity by Day of Week:")
        for day_idx, count in daily_activity.items():
            print(f"   {days[day_idx]}: {(count/len(df)*100):.1f}% of activity")

    # 2. USER SEGMENTATION FOR TARGETED MESSAGING
    print("\n\n2. USER SEGMENTATION (for targeted campaigns)")
    print("-" * 60)

    # Get user behavior patterns
    user_data = fetch_data({
        "select": "user_id,event_type",
        "limit": "50000"
    })

    if user_data:
        df_users = pd.DataFrame(user_data)
        user_segments = df_users.groupby('user_id')['event_type'].value_counts().unstack(fill_value=0)

        # Calculate conversion rates
        if 'view' in user_segments.columns and 'purchase' in user_segments.columns:
            user_segments['conversion_rate'] = user_segments['purchase'] / (user_segments['view'] + 1)

            # Segment users
            high_converters = (user_segments['conversion_rate'] > 0.1).sum()
            window_shoppers = ((user_segments['view'] > 10) & (user_segments['purchase'] == 0)).sum()
            cart_abandoners = ((user_segments['cart'] > 0) & (user_segments['purchase'] == 0)).sum()

            total_users = len(user_segments)

            print("\n👥 User Segments for Messaging Campaigns:")
            print(f"   🎯 High Converters (>10% conversion): {high_converters} ({high_converters/total_users*100:.1f}%)")
            print(f"   👀 Window Shoppers (views, no purchase): {window_shoppers} ({window_shoppers/total_users*100:.1f}%)")
            print(f"   🛒 Cart Abandoners: {cart_abandoners} ({cart_abandoners/total_users*100:.1f}%)")

    # 3. COMMUNICATION TRIGGERS
    print("\n\n3. AUTOMATED MESSAGING TRIGGERS")
    print("-" * 60)

    # Analyze cart abandonment patterns
    cart_data = fetch_data({
        "select": "user_id,event_type,event_time,product_id,price",
        "event_type": "in.(cart,purchase)",
        "limit": "10000"
    })

    if cart_data:
        df_cart = pd.DataFrame(cart_data)

        # Find cart abandonment rate
        cart_events = len(df_cart[df_cart['event_type'] == 'cart'])
        purchase_events = len(df_cart[df_cart['event_type'] == 'purchase'])

        if cart_events > 0:
            abandonment_rate = 1 - (purchase_events / cart_events)

            print("\n🛒 Cart Abandonment Insights:")
            print(f"   Abandonment Rate: {abandonment_rate*100:.1f}%")
            print(f"   → SMS Reminder Opportunity: {cart_events * abandonment_rate:.0f} messages/period")

            # Average cart value
            avg_cart_value = df_cart[df_cart['event_type'] == 'cart']['price'].mean()
            print(f"   Average Abandoned Cart Value: ${avg_cart_value:.2f}")
            print(f"   → Revenue Recovery Potential: ${avg_cart_value * cart_events * abandonment_rate:.2f}")

    # 4. PRODUCT INTEREST FOR NOTIFICATIONS
    print("\n\n4. PRODUCT CATEGORIES FOR PUSH NOTIFICATIONS")
    print("-" * 60)

    product_data = fetch_data({
        "select": "category_code,brand,event_type",
        "limit": "20000"
    })

    if product_data:
        df_products = pd.DataFrame(product_data)

        # Top categories
        top_categories = df_products['category_code'].value_counts().head(10)

        print("\n📱 Top Product Categories (for promotional messages):")
        for idx, (category, count) in enumerate(top_categories.items(), 1):
            if category:
                print(f"   {idx}. {category}: {count} interactions")

        # Top brands
        top_brands = df_products['brand'].value_counts().head(5)

        print("\n🏷️ Top Brands (for brand alerts):")
        for brand, count in top_brands.items():
            if brand:
                print(f"   • {brand}: {count} interactions")

    # 5. MESSAGING VOLUME ESTIMATES
    print("\n\n5. MESSAGING VOLUME PROJECTIONS")
    print("-" * 60)

    # Calculate potential message volumes
    total_users_sample = fetch_data({
        "select": "user_id",
        "limit": "50000"
    })

    if total_users_sample:
        df_volume = pd.DataFrame(total_users_sample)
        unique_users = df_volume['user_id'].nunique()

        print("\n📈 Estimated Message Volumes (per campaign type):")
        print(f"   Welcome Messages: {unique_users:,} (one-time)")
        print(f"   Cart Reminders: ~{int(unique_users * 0.3):,}/day")
        print(f"   Promotional: ~{int(unique_users * 0.7):,}/campaign")
        print(f"   Transactional: ~{int(unique_users * 1.5):,}/day")
        print(f"   Re-engagement: ~{int(unique_users * 0.15):,}/week")

        # Calculate API calls for Twilio-like service
        daily_messages = int(unique_users * 2.5)  # Average messages per user per day
        monthly_messages = daily_messages * 30

        print(f"\n💬 Total Estimated Monthly Messages: {monthly_messages:,}")
        print(f"   → Revenue at $0.0075/SMS: ${monthly_messages * 0.0075:,.2f}")
        print(f"   → Revenue at $0.01/WhatsApp: ${monthly_messages * 0.01:,.2f}")

    # 6. CUSTOMER LIFECYCLE INSIGHTS
    print("\n\n6. CUSTOMER LIFECYCLE MESSAGING")
    print("-" * 60)

    lifecycle_data = fetch_data({
        "select": "user_id,event_type,event_time",
        "order": "event_time.asc",
        "limit": "30000"
    })

    if lifecycle_data:
        df_lifecycle = pd.DataFrame(lifecycle_data)
        df_lifecycle['event_time'] = pd.to_datetime(df_lifecycle['event_time'])

        # User journey analysis
        user_journeys = df_lifecycle.groupby('user_id').agg({
            'event_time': ['min', 'max'],
            'event_type': 'count'
        })

        user_journeys.columns = ['first_seen', 'last_seen', 'total_events']
        user_journeys['lifetime_days'] = (user_journeys['last_seen'] - user_journeys['first_seen']).dt.days

        print("\n🔄 Customer Journey Metrics:")
        print(f"   Average Customer Lifetime: {user_journeys['lifetime_days'].mean():.1f} days")
        print(f"   Average Events per User: {user_journeys['total_events'].mean():.1f}")

        # Identify messaging opportunities
        print("\n📬 Automated Message Opportunities:")
        print("   → Day 0: Welcome message + onboarding")
        print("   → Day 1: First purchase incentive")
        print("   → Day 7: Engagement check-in")
        print("   → Day 30: Loyalty program invitation")
        print("   → Day 60: Re-engagement campaign")

    # 7. RECOMMENDATIONS FOR TWILIO-LIKE PLATFORM
    print("\n\n7. KEY RECOMMENDATIONS FOR MESSAGING PLATFORM")
    print("=" * 80)

    print("\n🎯 MUST-HAVE FEATURES:")
    print("   1. Cart Abandonment Recovery - High ROI potential")
    print("   2. Time-based Sending - Optimize for peak engagement hours")
    print("   3. Segmentation API - Target high-value customers")
    print("   4. Multi-channel Support - SMS, WhatsApp, Push")
    print("   5. Behavioral Triggers - Real-time event-based messaging")

    print("\n💰 PRICING STRATEGY INSIGHTS:")
    print("   • Volume-based tiers (most customers need 50K-200K msgs/month)")
    print("   • Premium features: Advanced segmentation, AI personalization")
    print("   • Industry focus: E-commerce has high message volumes")

    print("\n📊 API ENDPOINTS TO BUILD:")
    print("   POST /messages/send - Basic message sending")
    print("   POST /campaigns/broadcast - Bulk messaging")
    print("   POST /automations/cart-recovery - Automated workflows")
    print("   GET /analytics/engagement - Performance metrics")
    print("   POST /segments/create - Dynamic user groups")

if __name__ == "__main__":
    get_messaging_insights()