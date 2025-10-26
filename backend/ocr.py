from imutils.perspective import four_point_transform
import pytesseract
import imutils
import cv2
import re
import numpy as np


def scan_receipt(image_bytes):
    orig = cv2.imdecode(np.frombuffer(image_bytes, np.uint8), cv2.IMREAD_COLOR)
    image = orig.copy()
    image = imutils.resize(image, width=500)
    ratio = orig.shape[1] / float(image.shape[1])

    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edged = cv2.Canny(blurred, 75, 200)

    cnts = cv2.findContours(edged.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cnts = imutils.grab_contours(cnts)
    cnts = sorted(cnts, key=cv2.contourArea, reverse=True)

    receiptCnt = None
    for c in cnts:
        peri = cv2.arcLength(c, True)
        approx = cv2.approxPolyDP(c, 0.02 * peri, True)
        if len(approx) == 4:
            receiptCnt = approx
            break

    try:
        receipt = four_point_transform(orig, receiptCnt.reshape(4, 2) * ratio)
    except:
        print("Error: Could not recognize receipt edges")
        exit()

    # cv2.imshow("Receipt Transform", imutils.resize(receipt, width=500))
    # cv2.waitKey(0)

    options = "--psm 4"
    text = pytesseract.image_to_string(
        cv2.cvtColor(receipt, cv2.COLOR_BGR2RGB), config=options
    )

    pricePattern = r"([0-9]+\.[0-9]+)"
    totalPattern = r"(tot|due|bal).+([0-9]+\.[0-9]+)"
    name = text.split("\n")[0]
    total = ""
    items = []

    for row in text.split("\n"):
        if re.search(pricePattern, row) is not None:
            if re.search(totalPattern, row) is not None:
                total = row.split(" ")[-1]
            else:
                items.append(row)

    print(name)
    print(items)
    print(f"Total: {total}")

    return text
