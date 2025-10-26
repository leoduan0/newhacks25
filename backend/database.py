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
    insert_receipt(
        merchant_name=formatted["merchant_name"],
        items=formatted["items"],
        receipt_type=formatted["type"],
        total_amount=formatted["total_amount"],
        purchase_date=formatted["date"]
    )


def get_id():
    new_id = uuid.uuid1()
    response = supabase.table("response").select("id").eq("id", new_id).execute()

    if len(response.data) > 0:
        new_id = uuid.uuid1()

    return new_id


def switch_format(receipt_type: str, merchant_name: str, items: list[tuple[str, float]], total_amount: float, purchase_date=None) -> dict:
    item_list = []
    for item in items:
        item_dict = {
            "name": item[0],
            "cost": item[1],
            "created_at": str(datetime.now().isoformat()),
            "updated_at": str(datetime.now().isoformat()),
            "userId": "dc5b034a-d418-4e3f-8069-e7bb21550870",
        }
        item_list += item_dict

    formatted = {
        "store": merchant_name,
        "category": receipt_type,
        "imageUrl": "",
        "address": "",
        "phone": "",
        "notes": "",
        "createdAt": str(datetime.now().isoformat()),
        "updatedAt": str(datetime.now().isoformat()),
        "userId": "dc5b034a-d418-4e3f-8069-e7bb21550870",
        "items": item_list
    }

    return formatted


def insert_receipt(receipt_type: str, merchant_name: str, items: list[tuple[str, float]], total_amount: float, purchase_date=None):
    item_list = []
    for item in items:
        item_dict = {
            "name": item[0],
            "cost": item[1],
            "createdAt": str(datetime.now().isoformat()),
            "updatedAt": str(datetime.now().isoformat()),
            "userId": "dc5b034a-d418-4e3f-8069-e7bb21550870",
        }
        item_list += item_dict

    formatted = {
        "store": merchant_name,
        "category": receipt_type,
        "imageUrl": "",
        "address": "",
        "phone": "",
        "notes": "",
        "createdAt": str(datetime.now().isoformat()),
        "updatedAt": str(datetime.now().isoformat()),
        "userId": "dc5b034a-d418-4e3f-8069-e7bb21550870",
        "items": item_list
    }



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