import csv
from sentence_transformers import SentenceTransformer
from nucliadb.models import (
    CreateResourcePayload,
    InputMetadata,
    TextField,
    TextFormat,
)
from nucliadb_client.client import NucliaDBClient
from nucliadb_protos.utils_pb2 import Vector
from nucliadb_protos.resources_pb2 import FieldType
from bs4 import BeautifulSoup

client = NucliaDBClient(host="localhost", grpc=8060, http=8080, train=8031)

KBSLUG = "philosophy"
kb = client.get_kb(slug=KBSLUG)
if kb is None:
    kb = client.create_kb(slug=KBSLUG, title="StackExchange Philosophy Questions&Answers")

# get HugginFace sentence transformer model
model = SentenceTransformer("paraphrase-MiniLM-L6-v2")

def upload_question(title, text):
    payload = CreateResourcePayload()

    payload.title = title
    payload.icon = "text/html"
    payload.metadata = InputMetadata()
    payload.metadata.language = "en"

    field = TextField(body=text)
    field.format = TextFormat.HTML
    payload.texts["body"] = field

    resource = kb.create_resource(payload)

    # Now add index information
    tree = BeautifulSoup(text, features="html.parser")
    sentences = [child.get_text(" ", strip=True) for child in tree.contents]  # get the root children (mostly paragraphs, but they can be ul or h1, h2, etc)
    sentences = [sentence for sentence in sentences if len(sentence) > 0]
    pure_text = " ".join(sentences)
    resource.add_text("body", FieldType.TEXT, pure_text)

    embeddings = model.encode([title])

    # Title
    vector = Vector(
        start=0,
        end=len(title),
        start_paragraph=0,
        end_paragraph=len(title),
    )
    vector.vector.extend(embeddings[0])

    resource.add_vectors(
        "title",
        FieldType.GENERIC,
        [vector],
    )

    # Sentences
    vectors = []
    index = 0
    for sentence in sentences:
        vector = Vector(
            start=index,
            end=index + len(sentence),
            start_paragraph=0,
            end_paragraph=len(pure_text),
        )
        index += len(sentence) + 1
        embeddings = model.encode([sentence])
        vector.vector.extend(embeddings[0])
        vectors.append(vector)

    resource.add_vectors(
        "body",
        FieldType.TEXT,
        vectors,
    )

    resource.sync_commit()

def get_question_text(data):
    return "<br/><br/>".join(data[1:])

with open('./downloads/results.csv', "r", encoding="utf-8") as reader:
    csvFile = csv.reader(reader)
    count = 0
    for line in csvFile:
        title = line[0]
        text = get_question_text(line)
        count +=1
        print(f"Uploading {count}: {title}")
        upload_question(title, text)
