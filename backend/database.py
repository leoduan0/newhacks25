from supabase import create_client, Client
from datetime import datetime

SUPABASE_URL = "https://nanozurrlzthldwtxjwd.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hbm96dXJybHp0aGxkd3R4andkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzNzYwMDksImV4cCI6MjA3Njk1MjAwOX0.en43MD9oK3WUjJx8BOtbysgkZW4b0aStEYsdOxA8FeE"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def insert_receipt(store_name, items, purchase_date=None):
    try:
        # Calculate total
        total = sum(item["quantity"] * item["price"] for item in items)

        # Insert receipt
        receipt_data = {
            "store_name": store_name,
            "total_amount": total,
            "purchase_date": purchase_date or datetime.now().isoformat(),
        }
        receipt_response = supabase.table("receipts").insert(receipt_data).execute()
        receipt_id = receipt_response.data[0]["id"]

        # Insert items
        items_data = [
            {
                "receipt_id": receipt_id,
                "item_name": item["name"],
                "quantity": item["quantity"],
                "price": item["price"],
                "subtotal": item["quantity"] * item["price"],
            }
            for item in items
        ]
        items_response = supabase.table("receipt_items").insert(items_data).execute()

        return {"receipt_id": receipt_id, "items": items_response.data}
    except Exception as e:
        print(f"Error inserting receipt: {e}")
        return None


def get_receipt(receipt_id):  # Get receipt
    receipt = supabase.table("receipts").select("*").eq("id", receipt_id).execute()

    # Get items for this receipt
    items = (
        supabase.table("receipt_items")
        .select("*")
        .eq("receipt_id", receipt_id)
        .execute()
    )

    return {"receipt": receipt.data[0] if receipt.data else None, "items": items.data}
