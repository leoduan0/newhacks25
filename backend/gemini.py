from google import genai
from pydantic import BaseModel
from datetime import date
import enum

class Category(enum.Enum):
    GROCERY = "Grocery"
    INVOICE = "Invoice"
    CLOTHING = "Clothing"
    RESTAURANT = "Restaurant"
    MISCELLANEOUS = "Miscellaneous"
    
class Receipt(BaseModel):
    type: Category
    merchant_name: str
    items: list[tuple[str, float]]
    total_amount: float
    date: date

client = genai.Client()

def analyze_receipt(text: str):
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=[f"This is text from a receipt. Evaluate what kind of purchase this is, \
            provide the merchant name, generate a list comprised of all individual items and their prices in tuples, \
                the total balance due, and receipt date", str],
        config = {
            "response_mime_type": "application/json",
            "response_schema": Receipt,
            "propertyOrdering": ["type", "merchant_name", "items", "total_amount", "date"],
        })

    print(response.text)
    my_receipts: Receipt = response.parsed
    return my_receipts
