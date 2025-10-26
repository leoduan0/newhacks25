from supabase import create_client, Client
from datetime import datetime
import os

supabase: Client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

def get_highest_id():
    response = supabase.table('records').select("id").order('id', desc=True).limit(1).execute()

    if response.data:
        highest_id = response.data[0]['id']
        print(f"Highest ID: {highest_id}")
        return int(highest_id)
    else:
        return -1


def insert_receipt(store_name, items, user_id, purchase_date=None, notes=""):
    """
    Sample Input

    "Walmart", [{"name": "Apple", "category": 1, "price": 3}], "13"
    """

    for item in items:
        try:
            # Insert receipt
            row_data = {
                "id": get_highest_id() + 1,
                "store": store_name,
                # "name": item["name"],
                "amount": item["price"],
                "category": item["category"],
                "date": purchase_date or datetime.now().isoformat(),
                "image_url": "N/A",
                "notes": notes,
                "createdAt": datetime.now().isoformat(),
                "updated_at": datetime.now().isoformat(),
                "user_id": user_id
            }

            response = (
                supabase.table("records")
                .insert(row_data)
                .execute()
            )
            print(response)

        except Exception as e:
            print(f"Error inserting receipt: {e}")
            return None

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
    insert_receipt("Walmart", [{"name": "Apple", "category": "TRAVEL", "price": 3}], 13)