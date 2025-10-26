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
        purchase_date=formatted["date"],
    )


def get_id(table_name: str):
    new_id = str(uuid.uuid1())
    response = supabase.table(table_name).select("id").eq("id", new_id).execute()

    if len(response.data) > 0:
        new_id = str(uuid.uuid1())

    return new_id


def insert_data(receipt_data) -> dict:
    # Convert Pydantic model to dict if needed
    if hasattr(receipt_data, "model_dump"):
        receipt_dict = receipt_data.model_dump()
    elif hasattr(receipt_data, "dict"):
        receipt_dict = receipt_data.dict()
    else:
        receipt_dict = receipt_data

    receipt_id = get_id("records")

    # Convert enum to string value if needed
    category = receipt_dict["receipt_type"]
    if hasattr(category, "value"):
        category = category.value

    # First, insert the record so it exists for foreign key constraints
    records = {
        "id": receipt_id,
        "store": receipt_dict["merchant_name"],
        "category": category,
        "image_url": "",
        "address": receipt_dict["merchant_address"],
        "phone": receipt_dict["merchant_phone"],
        "notes": "",
        "purchase_date": str(receipt_dict["purchase_date"]),
        "created_at": str(datetime.now().isoformat()),
        "updated_at": str(datetime.now().isoformat()),
        "user_id": "dc5b034a-d418-4e3f-8069-e7bb21550870",
    }
    supabase.table("records").insert(records).execute()

    # Then insert items and create relationships
    for item in receipt_dict["items"]:
        item_id = get_id("items")
        item_dict = {
            "id": item_id,
            "name": item["name"],
            "cost": item["price"],
            "created_at": str(datetime.now().isoformat()),
            "updated_at": str(datetime.now().isoformat()),
            # "user_id": "dc5b034a-d418-4e3f-8069-e7bb21550870",
        }
        supabase.table("items").insert(item_dict).execute()
        supabase.table("_TransactionItems").insert(
            {"A": item_id, "B": receipt_id}
        ).execute()


def get_row_by_id(row_id: str):
    try:
        response = supabase.table("records").select("*").eq("id", row_id).execute()

        # Check if data exists
        if response.data:
            return response.data[
                0
            ]  # Returns the first (and should be only) matching row
        else:
            return None

    except Exception as e:
        print(f"Error retrieving data: {e}")
        return None


def get_all_rows():
    return supabase.table("records").select("*").execute().data
