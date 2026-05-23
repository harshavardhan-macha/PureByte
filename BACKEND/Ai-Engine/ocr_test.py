import easyocr

print("loading ocr model . . . .")
reader = easyocr.Reader(['en'])

print("analyzing image .. . ")
results = reader.readtext('./data/car.jpeg', detail = 0)
for line in results:
    print(line)