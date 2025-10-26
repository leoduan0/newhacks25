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
    new_id = str(uuid.uuid1())
    response = supabase.table(table_name).select("id").eq("id", new_id).execute()

    if len(response.data) > 0:
        new_id = str(uuid.uuid1())

    return new_id

def insert_data(receipt_data) -> dict:
    # Convert Pydantic model to dict if needed
    if hasattr(receipt_data, 'model_dump'):
        receipt_dict = receipt_data.model_dump()
    elif hasattr(receipt_data, 'dict'):
        receipt_dict = receipt_data.dict()
    else:
        receipt_dict = receipt_data
    
    receipt_id = get_id("records")
    
    # Convert enum to string value if needed
    category = receipt_dict["receipt_type"]
    if hasattr(category, 'value'):
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
        supabase.table("_TransactionItems").insert({'A': item_id, 'B': receipt_id}).execute()


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


if __name__ == "__main__":
    import gemini as gem

    insert_data(gem.analyze_receipt(
        "Walmart Save money. Live better. ( 330 ) 39 - 3991 MANAGER D/ANA EARNEST 231 BLUEBELL DR SW HEW PH/LADELEMA OH 44663 sue 02115 ova PET TOY 009044 use ea fad 004747571656 01301 1.97 FLOPPY PUPPY 004747514846 SSSUPRIE46 S 070060332153 1.97 4.97 2.5 SWEAR MEC. OREM 084699803238 0613113103796 5.92 3.77 DOG TREAT 007119013654 118 2 2.92 . 0 PED PCH 1 COUPON 23100 002310011802 052310037000 0.50 HEY. SNORES FRENCH DRSNO 088491226037 P 004132100655 P 3:::- 1.98 3 ORANGES BABY CARROTS 001466835001 P 003338366602 I 5.47 1.48 COLLARDS CALEONE 000000004614Kr 005206362080 6. 1.:: 2. MM RVW ENT STROBRLPLABL 003399105848 001558679414 19.77 STROBRLPLABL STRO SUNFLWR 001558679414 001558679410 1::; STRO SUNFLWR STRO SUNFLWR 001558679410 001550679410 :::; STE° SUNFLWR BLING BEADS 001558679410 076594060699 0.97 0.97 GREAT VALUE 007874203191 P fltrZO ::=1101t 12.44 TAR 1 6.750 93.62 4.59 TOTAL VISA TEED 98.21 98.21 APPROVAL 572866 REP if 720900544961 TRANS ID - 387209239650894 VALIDATION - 57118 PAYMENT SERVICE - E TERMINAL SC010764 *signature verified TC# 0441 rfl'-fn'lN';'Dbr,1 5140 MOE 11E1111111 "
    ))