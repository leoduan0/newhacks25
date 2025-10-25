from supabase import create_client, Client
from datetime import datetime

SUPABASE_URL = "https://nanozurrlzthldwtxjwd.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hbm96dXJybHp0aGxkd3R4andkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNzYwMDksImV4cCI6MjA3Njk1MjAwOX0.en43MD9oK3WUjJx8BOtbysgkZW4b0aStEYsdOxA8FeE"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def get_highest_id():
    response = supabase.table('records_test').select("receipt_id").order('receipt_id', desc=True).limit(1).execute()

    if response.data:
        highest_id = response.data[0]['receipt_id']
        print(f"Highest ID: {highest_id}")
        return int(highest_id)
    else:
        return -1


def insert_receipt(store_name, items, purchase_date=None):
    """
    Sample Input

    "Walmart", [{"name": "Apple", "category": 1, "price": 3}]
    """

    try:
        # Calculate total
        total = sum(item["price"] for item in items)

        # Items data
        items_data = [
            {
                "item_name": item["name"],
                "category": item["category"],
                "price": item["price"],
            }
            for item in items
        ]

        # Insert receipt
        receipt_data = {
            "receipt_id": get_highest_id() + 1,
            "store_name": store_name,
            "total_amount": total,
            "purchase_date": purchase_date or datetime.now().isoformat(),
            "items": items_data,
        }

        response = (
            supabase.table("records_test")
            .insert(receipt_data)
            .execute()
        )

        return response

    except Exception as e:
        print(f"Error inserting receipt: {e}")
        return None


def get_receipt(receipt_id):  # Get receipt
    receipt = supabase.table("records_test").select("*").eq("id", receipt_id).execute()

    # Get items for this receipt
    items = (
        supabase.table("receipt_items")
        .select("*")
        .eq("receipt_id", receipt_id)
        .execute()
    )

    return {"receipt": receipt.data[0] if receipt.data else None, "items": items.data}


if __name__ == "__main__":
    insert_receipt("Walmart", [{"name": "Apple", "category": "hh", "price": 3}])