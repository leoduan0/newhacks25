from supabase import create_client, Client
from datetime import datetime
import os
import json
from dotenv import load_dotenv

load_dotenv()
supabase: Client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))

def get_highest_id():
    response = supabase.table('records').select("id").order('id', desc=True).limit(1).execute()

    if response.data:
        highest_id = response.data[0]['id']
        print(f"Highest ID: {highest_id}")
        return int(highest_id)
    else:
        return -1


def insert_receipt(receipt_type: str, merchant_name: str, items: list[tuple[str, float]], total_amount: float, purchase_date=None):
    """
    Sample Input

    "Walmart", [("Apple", 3.0)], "TRAVEL"
    """
    try:
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


def get_row_by_id(row_id: str):
    try:
        response = supabase.table("records").select("*").eq("id", row_id).execute()

        # Check if data exists
        if response.data:
            return response.data[0]  # Returns the first (and should be only) matching row
        else:
            return None

    except Exception as e:
        print(f"Error retrieving data: {e}")
        return None


def load_from_json(json_text: str):
    formatted = json.loads(json_text)
    insert_receipt(
        merchant_name=formatted["merchant_name"], 
        items=formatted["items"],
        receipt_type=formatted["type"],
        total_amount=formatted["total_amount"],
        purchase_date=formatted["date"]
    )