from google import genai
from pydantic import BaseModel
from datetime import date
import enum
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

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

# Initialize Gemini client with API key from environment
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY not found in environment variables")

client = genai.Client(api_key=api_key)

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