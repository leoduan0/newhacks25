from supabase import create_client, Client
from datetime import datetime
import os
import json

supabase: Client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

def get_highest_id():
    response = supabase.table('records').select("id").order('id', desc=True).limit(1).execute()

    if response.data:
        highest_id = response.data[0]['id']
        print(f"Highest ID: {highest_id}")
        return int(highest_id)
    else:
        return -1


def insert_receipt(merchant_name: str, items: list[tuple[str, float]], receipt_type: str, purchase_date=None):
    """
    Sample Input

    "Walmart", [{"name": "Apple", "category": 1, "price": 3}], "13"
    """
    try:
        total_amount = 0
        for item in items:
            total_amount += item[1]

        row_data = {
            "id": get_highest_id() + 1,
            "type": receipt_type,
            "merchant_name": merchant_name,
            "items": items,
            "total_amount": total_amount,
            "date": str(purchase_date) or str(datetime.now().isoformat()),
        }

        response = (supabase.table("records").insert(row_data).execute())
        print(response)

    except Exception as e:
        print(f"Error inserting receipt: {e}")
        return None

    return None


def get_receipt(receipt_id):  # Get receipt
    receipt = supabase.table("records").select("*").eq("id", receipt_id).execute()

    # Get items for this receipt
    items = (
        supabase.table("receipt_items")
        .select("*")
        .eq("receipt_id", receipt_id)
        .execute()
    )

    return {"receipt": receipt.data[0] if receipt.data else None, "items": items.data}


def load_from_json(json_text: str):
    formatted = json.loads(json_text)
    insert_receipt(
        merchant_name=formatted["merchant_name"], 
        items=formatted["items"],
        receipt_type=formatted["type"],
        purchase_date=formatted["date"]
    )