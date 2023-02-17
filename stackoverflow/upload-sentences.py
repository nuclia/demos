import csv
from nucliadb_sdk.utils import get_or_create, create_knowledge_box
from sentence_transformers import SentenceTransformer
from bs4 import BeautifulSoup

KBSLUG = "philosophy"
kb = get_or_create(KBSLUG)
# kb = create_knowledge_box(KBSLUG)

encoder = SentenceTransformer("all-MiniLM-L6-v2")

def upload_question(title, text):
    tree = BeautifulSoup(text, features="html.parser")
    sentences = [title] + [child.get_text(" ", strip=True) for child in tree.contents]  # get the root children (mostly paragraphs, but they can be ul or h1, h2, etc)
    sentences = [sentence for sentence in sentences if len(sentence) > 0]
    for sentence in sentences:
        kb.upload(
            text=sentence,
            vectors={"all-MiniLM-L6-v2": encoder.encode([sentence])[0]},
        )

def get_question_text(data):
    return "<br/><br/>".join(data)

offset = 856
with open('./dist/data/results.csv', "r", encoding="utf-8") as reader:
    csvFile = csv.reader(reader)
    count = 0
    for line in csvFile:
        count +=1
        if count <= offset:
            continue
        title = line[0]
        text = get_question_text(line)
        print(f"Uploading {count}: {title}")
        upload_question(title, text)