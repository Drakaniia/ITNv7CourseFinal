import requests
from bs4 import BeautifulSoup

# URL of the webpage
url = "https://infraexam.com/ccna1-v7/ccna1-v7-itnv7-final-exam-answers/"

# Fetch the webpage
response = requests.get(url)
response.raise_for_status()  # Raise an error for bad status codes

# Parse the HTML content
soup = BeautifulSoup(response.text, "html.parser")

# Find all elements with color #cc0000 and append (answer) to their text
for element in soup.find_all(style=lambda value: value and "color: #cc0000" in value):
    element.string = f"{element.get_text()} (answer)"

# Extract the modified text
modified_text = soup.get_text()

# Save the modified text to a file
with open("modified_text_with_answers.txt", "w", encoding="utf-8") as file:
    file.write(modified_text)

print(
    "Text extraction complete. Modified text with answers saved to 'modified_text_with_answers.txt'."
)
