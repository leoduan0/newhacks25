from google import genai
from pydantic import BaseModel
from datetime import date
import enum
import os
from dotenv import load_dotenv

load_dotenv()


class Category(enum.Enum):
    GROCERIES = "GROCERIES"
    INVOICE = "INVOICE"
    SHOPPING = "SHOPPING"
    ENTERTAINMENT = "ENTERTAINMENT"
    TRANSPORTATION = "TRANSPORTATION"
    UTILITIES = "UTILITIES"
    DINING = "DINING"
    MISC = "MISC"


class Item(BaseModel):
    name: str
    price: float


class Receipt(BaseModel):
    receipt_type: Category
    merchant_name: str
    merchant_address: str | None
    merchant_phone: str | None
    items: list[Item]
    purchase_date: date


api_key = os.environ["GEMINI_API_KEY"]
print(f"API: {api_key}")
client = genai.Client(api_key=api_key)


def analyze_receipt(text: str):
    response = client.models.generate_content(
        model="gemini-2.0-flash-exp",
        contents=f"This is text from a receipt. Analyze and extract: category of purchase in uppercase, merchant name, \
            merchant address, merchant phone, list of items with their names and prices, and date. Receipt text: {text}",
        config={
            "response_mime_type": "application/json",
            "response_schema": Receipt,
        },
    )

    print(response.text)
    my_receipts: Receipt = response.parsed
    return my_receipts
