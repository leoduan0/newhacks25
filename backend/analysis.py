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


def