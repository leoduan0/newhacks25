from supabase import create_client, Client
from datetime import datetime
import os
import json
from dotenv import load_dotenv
import uuid

load_dotenv()
supabase: Client = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))


def load_from_json(json_text: str):
    formatted = json.loads(json_text)
    insert_data(
        merchant_name=formatted["merchant_name"],
        items=formatted["items"],
        receipt_type=formatted["type"],
        total_amount=formatted["total_amount"],
        purchase_date=formatted["date"]
    )


def get_id(table_name: str):
    new_id = uuid.uuid1()
    response = supabase.table(table_name).select("id").eq("id", new_id).execute()

    if len(response.data) > 0:
        new_id = uuid.uuid1()

    return new_id


def insert_data(receipt_type: str, merchant_name: str, items: list, total_amount: float, purchase_date=None) -> dict:
    receipt_id = get_id("records")

    for item in items:
        item_id = get_id("items")
        item_dict = {
            "id": item_id,
            "name": item["name"],
            "cost": item["price"],
            "created_at": str(datetime.now().isoformat()),
            "updated_at": str(datetime.now().isoformat()),
            "userId": "dc5b034a-d418-4e3f-8069-e7bb21550870",
        }
        supabase.table("items").insert(item_dict).execute()
        supabase.table("_TransactionItems").insert({'A': item_id, 'B': receipt_id}).execute()

    records = {
        "id": receipt_id,
        "store": merchant_name,
        "category": receipt_type,
        "imageUrl": "",
        "address": "",
        "phone": "",
        "notes": "",
        "createdAt": str(datetime.now().isoformat()),
        "updatedAt": str(datetime.now().isoformat()),
        "userId": "dc5b034a-d418-4e3f-8069-e7bb21550870",
    }
    supabase.table("records").insert(records).execute()


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


def get_all_rows():
    return supabase.table("records").select("*").execute()