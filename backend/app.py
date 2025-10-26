from flask import Flask, request, jsonify
from flask_cors import CORS
import base64
import os
from datetime import datetime
import ocr
import gemini
import database
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)


@app.route("/scan", methods=["POST"])
def scan():
    try:
        data = request.get_json()

        if not data or "image" not in data:
            return jsonify({"success": False, "error": "No image provided"}), 400

        image_base64 = data["image"]
        print(f"Received image data at {datetime.now()}")

        image_bytes = base64.b64decode(image_base64)
        receipt_data = ocr.scan_receipt(image_bytes)
        interpreted_receipt = gemini.analyze_receipt(receipt_data, image_bytes)
        database.insert_data(interpreted_receipt)

        return (
            jsonify(
                {
                    "success": True,
                    "message": "Receipt uploaded successfully.",
                    "timestamp": datetime.now().isoformat(),
                }
            ),
            200,
        )
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/analytics/stats", methods=["GET"])
def get_analytics_stats():
    """
    Get analytics stats for a specific time period.

    Query params:
    - period: "week", "month", or "year" (default: "month")
    - offset: number of periods to go back (default: 0)
    - user_id: optional user ID filter
    """
    try:
        print("\nAnalytics stats request received")
        period_type = request.args.get("period", "month")
        offset = int(request.args.get("offset", 0))
        user_id = request.args.get("user_id", None)

        current_start, current_end = database.get_date_ranges(period_type, offset)
        previous_start, previous_end = database.get_date_ranges(period_type, offset - 1)
        stats = database.get_comparison_stats(
            current_start, current_end, previous_start, previous_end, user_id
        )

        period_name = database.get_period_display_name(period_type, offset)

        response = {
            "period": {
                "type": period_type,
                "offset": offset,
                "name": period_name,
                "start_date": current_start,
                "end_date": current_end,
            },
            "summary": {
                "total_spent": round(stats["current"]["total_spent"], 2),
                "total_purchases": stats["current"]["total_purchases"],
                "average_purchase": round(stats["current"]["average_purchase"], 2),
            },
            "changes": stats["changes"],
            "categories": [
                {
                    "name": category,
                    "total": round(data["total"], 2),
                    "count": data["count"],
                    "percentage": round(data["percentage"], 1),
                }
                for category, data in stats["current"]["categories"].items()
            ],
        }

        return jsonify(response), 200

    except Exception as e:
        print(f"Error in analytics: {e}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ["PORT"]), debug=True)
