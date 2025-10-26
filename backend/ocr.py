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
    blurred = cv2.GaussianBlur(gray, (5, 5), 1.4)
    edged = cv2.Canny(blurred, 100, 200)

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

    unsharp = cv2.addWeighted(
        receipt, 2.0, cv2.GaussianBlur(receipt, (0, 0), 3), -1.0, 0
    )
    sharpen_kernel = np.array([[0, -1, 0], [-1, 5, -1], [0, -1, 0]])
    sharp = cv2.filter2D(unsharp, -1, sharpen_kernel)
    bilateral = cv2.bilateralFilter(sharp, 11, 80, 80)

    options = "--psm 4"
    text = pytesseract.image_to_string(
        cv2.cvtColor(bilateral, cv2.COLOR_BGR2RGB), config=options
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
