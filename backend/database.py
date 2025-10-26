from supabase import create_client, Client
from datetime import datetime, timedelta
import dateutil.parser as parser
import os
import json
import uuid
from dotenv import load_dotenv

load_dotenv()


url: str = os.environ["SUPABASE_URL"]
key: str = os.environ["SUPABASE_KEY"]
supabase: Client = create_client(url, key)


def load_from_json(json_text: str):
    formatted = json.loads(json_text)
    insert_data(
        merchant_name=formatted["merchant_name"],
        items=formatted["items"],
        receipt_type=formatted["type"],
        total_amount=formatted["total_amount"],
        purchase_date=formatted["date"],
    )


def get_id(table_name: str):
    new_id = str(uuid.uuid1())
    response = supabase.table(table_name).select("id").eq("id", new_id).execute()

    if len(response.data) > 0:
        new_id = str(uuid.uuid1())

    return new_id


def insert_data(receipt_data) -> dict:
    if hasattr(receipt_data, "model_dump"):
        receipt_dict = receipt_data.model_dump()
    elif hasattr(receipt_data, "dict"):
        receipt_dict = receipt_data.dict()
    else:
        receipt_dict = receipt_data

    receipt_id = get_id("records")

    category = receipt_dict["receipt_type"]
    if hasattr(category, "value"):
        category = category.value

    records = {
        "id": receipt_id,
        "store": receipt_dict["merchant_name"],
        "category": category,
        "image_url": "",
        "address": receipt_dict.get("merchant_address") or "N/A",
        "phone": receipt_dict.get("merchant_phone") or "N/A",
        "notes": "",
        "purchase_date": parser.parse(receipt_dict["purchase_date"]).isoformat(),
        "created_at": str(datetime.now().isoformat()),
        "updated_at": str(datetime.now().isoformat()),
        "user_id": "dc5b034a-d418-4e3f-8069-e7bb21550870",
    }
    supabase.table("records").insert(records).execute()

    for item in receipt_dict["items"]:
        item_id = get_id("items")
        item_dict = {
            "id": item_id,
            "name": item["name"],
            "cost": item["price"],
            "created_at": str(datetime.now().isoformat()),
            "updated_at": str(datetime.now().isoformat()),
        }
        supabase.table("items").insert(item_dict).execute()
        supabase.table("_TransactionItems").insert(
            {"A": item_id, "B": receipt_id}
        ).execute()


def get_row_by_id(row_id: str):
    try:
        response = supabase.table("records").select("*").eq("id", row_id).execute()

        if response.data:
            return response.data[0]
        else:
            return None

    except Exception as e:
        print(f"Error retrieving data: {e}")
        return None


def get_all_rows():
    return supabase.table("records").select("*").execute().data


def get_transactions_by_period(start_date: str, end_date: str, user_id: str = None):
    """
    Fetch transactions within a date range with their items.
    Returns transactions with nested items.
    
    Args:
        start_date: ISO format date string (YYYY-MM-DD)
        end_date: ISO format date string (YYYY-MM-DD)
        user_id: Optional user ID filter
    
    Returns:
        List of transaction dictionaries with nested items
    """
    try:
        print(f"[DEBUG] Fetching transactions from {start_date} to {end_date}, user_id={user_id}")
        
        # First, get all records to see what we're working with
        # Note: Adding time to ensure full day coverage (start of start_date to end of end_date)
        start_datetime = f"{start_date}T00:00:00"
        end_datetime = f"{end_date}T23:59:59"
        
        print(f"[DEBUG] Querying with datetime range: {start_datetime} to {end_datetime}")
        
        query = supabase.table("records").select(
            "id, category, purchase_date"
        )
        
        # Apply filters - using datetime strings for proper comparison
        query = query.gte("purchase_date", start_datetime).lte("purchase_date", end_datetime)
        query = query.order("purchase_date", desc=True)
        response = query.execute()
        
        print(f"[DEBUG] Found {len(response.data) if response.data else 0} transactions")
        
        if not response.data:
            return []
        
        # For each transaction, fetch its items through the junction table
        transactions = response.data
        for transaction in transactions:
            try:
                # Get item IDs from junction table
                junction_response = supabase.table("_TransactionItems").select("A").eq("B", transaction["id"]).execute()
                
                if junction_response.data:
                    item_ids = [row["A"] for row in junction_response.data]
                    # Fetch actual items
                    if item_ids:
                        items_response = supabase.table("items").select("name, cost").in_("id", item_ids).execute()
                        transaction["items"] = items_response.data if items_response.data else []
                        print(f"[DEBUG] Transaction {transaction['id'][:8]}... has {len(transaction['items'])} items, total: ${sum(item['cost'] for item in transaction['items']):.2f}")
                    else:
                        transaction["items"] = []
                else:
                    transaction["items"] = []
                    print(f"[DEBUG] Transaction {transaction['id'][:8]}... has no items in junction table")
            except Exception as item_error:
                print(f"[ERROR] Error fetching items for transaction {transaction['id']}: {item_error}")
                transaction["items"] = []
        
        return transactions
    except Exception as e:
        print(f"[ERROR] Error in get_transactions_by_period: {e}")
        import traceback
        traceback.print_exc()
        return []


def calculate_period_stats(start_date: str, end_date: str, user_id: str = None):
    """
    Calculate statistics for a given time period:
    - Total spent per category
    - Number of purchases per category
    - Total purchases
    - Total amount
    - Average purchase
    
    Args:
        start_date: ISO format date string (YYYY-MM-DD)
        end_date: ISO format date string (YYYY-MM-DD)
        user_id: Optional user ID filter
    
    Returns:
        Dictionary with statistics including category breakdowns
    """
    transactions = get_transactions_by_period(start_date, end_date, user_id)
    
    stats = {
        "categories": {},
        "total_spent": 0,
        "total_purchases": 0,
        "average_purchase": 0
    }
    
    for transaction in transactions:
        category = transaction["category"]
        
        # Calculate total for this transaction
        transaction_total = 0
        if transaction.get("items"):
            transaction_total = sum(item["cost"] for item in transaction["items"])*1.13  # Including tax
        
        # Initialize category if needed
        if category not in stats["categories"]:
            stats["categories"][category] = {
                "total": 0,
                "count": 0,
                "percentage": 0
            }
        
        # Update category stats
        stats["categories"][category]["total"] += transaction_total
        stats["categories"][category]["count"] += 1
        
        # Update overall stats
        stats["total_spent"] += transaction_total
        stats["total_purchases"] += 1
    
    # Calculate average and percentages
    if stats["total_purchases"] > 0:
        stats["average_purchase"] = stats["total_spent"] / stats["total_purchases"]
        
        # Calculate percentage for each category
        for category in stats["categories"]:
            if stats["total_spent"] > 0:
                stats["categories"][category]["percentage"] = (
                    stats["categories"][category]["total"] / stats["total_spent"]
                ) * 100
    
    return stats

# main function to return all stats
def get_comparison_stats(current_start: str, current_end: str, previous_start: str, previous_end: str, user_id: str = None):
    """
    Compare stats between two time periods.
    Returns current stats with percentage changes from previous period.
    
    Args:
        current_start: Start date of current period (YYYY-MM-DD)
        current_end: End date of current period (YYYY-MM-DD)
        previous_start: Start date of previous period (YYYY-MM-DD)
        previous_end: End date of previous period (YYYY-MM-DD)
        user_id: Optional user ID filter
    
    Returns:
        Dictionary with current stats and changes from previous period
    """
    current_stats = calculate_period_stats(current_start, current_end, user_id)
    print(f"[DEBUG] Current stats: {current_stats}")
    previous_stats = calculate_period_stats(previous_start, previous_end, user_id)
    
    # Calculate percentage changes
    spending_change = 0
    if previous_stats["total_spent"] > 0:
        spending_change = ((current_stats["total_spent"] - previous_stats["total_spent"]) / previous_stats["total_spent"]) * 100
    
    purchases_change = current_stats["total_purchases"] - previous_stats["total_purchases"]
    
    average_change = 0
    average_status = "Stable"
    if previous_stats["average_purchase"] > 0:
        average_change = ((current_stats["average_purchase"] - previous_stats["average_purchase"]) / previous_stats["average_purchase"]) * 100
        if abs(average_change) < 5:
            average_status = "Stable"
        elif average_change > 0:
            average_status = "Up"
        else:
            average_status = "Down"
    
    return {
        "current": current_stats,
        "previous": previous_stats,
        "changes": {
            "spending_percent": round(spending_change, 1),
            "purchases_count": int(purchases_change),
            "average_percent": round(average_change, 1),
            "average_status": average_status
        }
    }

# -------------------------- ALL CORRECT BELOW THIS LINE -------------------------- #

def get_date_ranges(period_type: str, offset: int = 0):
    """
    Calculate date ranges for different period types.
    
    Args:
        period_type: "week", "month", or "year"
        offset: Number of periods to go back (0 = current, -1 = previous, etc.)
    
    Returns:
        Tuple of (start_date, end_date) as ISO format strings
    """
    today = datetime.now().date()
    
    if period_type == "week":
        # Get start of current week (Monday)
        current_week_start = today - timedelta(days=today.weekday())
        # Apply offset (negative offset = go back in time)
        period_start = current_week_start - timedelta(weeks=abs(offset))
        period_end = period_start + timedelta(days=6)
    
    elif period_type == "month":
        # Calculate the month with offset (negative = go back)
        month = today.month - abs(offset)
        year = today.year
        
        while month < 1:
            month += 12
            year -= 1
        while month > 12:
            month -= 12
            year += 1
        
        period_start = datetime(year, month, 1).date()
        
        # Last day of the month
        if month == 12:
            next_month = datetime(year + 1, 1, 1).date()
        else:
            next_month = datetime(year, month + 1, 1).date()
        period_end = next_month - timedelta(days=1)
    
    elif period_type == "year":
        year = today.year - abs(offset)
        period_start = datetime(year, 1, 1).date()
        period_end = datetime(year, 12, 31).date()
    
    else:
        raise ValueError("period_type must be 'week', 'month', or 'year'")
    
    return (period_start.isoformat(), period_end.isoformat())


def get_period_display_name(period_type: str, offset: int = 0):
    """
    Get a human-readable display name for the period.
    
    Args:
        period_type: "week", "month", or "year"
        offset: Number of periods to go back
    
    Returns:
        String like "October 2025" or "Week of Oct 20, 2025"
    """
    start_date, end_date = get_date_ranges(period_type, offset)
    start = datetime.fromisoformat(start_date)
    
    if period_type == "week":
        return f"Week of {start.strftime('%b %d, %Y')}"
    elif period_type == "month":
        return start.strftime("%B %Y")
    elif period_type == "year":
        return str(start.year)
    
    return ""