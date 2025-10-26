import database as db

def count_categories():
    category_count = {}
    all_rows = db.get_all_rows()

    for row in all_rows:
        category = row["category"]
        if category not in category_count:
            category_count[category] = 1
        else:
            category_count[category] += 1

    return category_count


def sort_by_date(num_entries: int=0):
    # Descending
    purchase_by_date = []
    all_rows = db.get_all_rows()

    for row in all_rows:
        entry = {
            "row_id": row["id"],
            "store": row["store"],
            "date": row["purchase_date"]
        }

        for i in range(len(purchase_by_date)):
            if purchase_by_date[i]["date"] > entry["date"]:
                continue
            else:
                purchase_by_date.insert(i, entry)
                break

    if num_entries == 0:
        return purchase_by_date
    else:
        return purchase_by_date[:num_entries]