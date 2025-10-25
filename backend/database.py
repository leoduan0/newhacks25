from supabase import create_client, Client
from datetime import datetime
import os

import psycopg2
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

# Fetch variables
USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")

# Connect to the database
try:
    connection = psycopg2.connect(
        user=USER,
        password=PASSWORD,
        host=HOST,
        port=PORT,
        dbname=DBNAME
    )
    print("Connection successful!")

    # Create a cursor to execute SQL queries
    cursor = connection.cursor()

    # Example query
    cursor.execute("SELECT NOW();")
    result = cursor.fetchone()
    print("Current Time:", result)

    # Close the cursor and connection
    cursor.close()
    connection.close()
    print("Connection closed.")

except Exception as e:
    print(f"Failed to connect: {e}")

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

def insert_receipt(store_name, items, purchase_date=None):
    """
    Insert a receipt with multiple items

    items: list of dicts with 'name', 'quantity', 'price'
    Example: [
        {'name': 'Apple', 'quantity': 3, 'price': 1.50},
        {'name': 'Bread', 'quantity': 1, 'price': 2.99}
    ]
    """
    try:
        # Calculate total
        total = sum(item['quantity'] * item['price'] for item in items)

        # Insert receipt
        receipt_data = {
            'store_name': store_name,
            'total': total,
            'date': purchase_date or datetime.now().isoformat()
        }
        receipt_response = supabase.table('receipts').insert(receipt_data).execute()
        receipt_id = receipt_response.data[0]['id']

        # Insert items
        items_data = [
            {
                'receipt_id': receipt_id,
                'item_name': item['name'],
                'quantity': item['quantity'],
                'price': item['price'],
                'subtotal': item['quantity'] * item['price']
            }
            for item in items
        ]
        items_response = supabase.table('receipt_items').insert(items_data).execute()

        return {
            'receipt_id': receipt_id,
            'items': items_response.data
        }

    except Exception as e:
        print(f"Error inserting receipt: {e}")
        return None


# Usage
items = [
    {'name': 'Milk', 'quantity': 2, 'price': 3.99},
    {'name': 'Eggs', 'quantity': 1, 'price': 4.50},
    {'name': 'Bread', 'quantity': 1, 'price': 2.99}
]

result = insert_receipt('Walmart', items)
print(result)