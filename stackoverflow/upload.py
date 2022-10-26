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

kb = client.get_kb(slug="stackoverflow")
if kb is None:
    kb = client.create_kb(slug="stackoverflow", title="StackOverflow Questions&Answers about CSS")

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
    good_text = tree.get_text().replace("\n", " \n ")
    resource.add_text("body", FieldType.TEXT, good_text)

    embeddings = model.encode([title, text])

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

    # Body
    vector = Vector(
        start=0,
        end=len(text),
        start_paragraph=0,
        end_paragraph=len(text),
    )
    vector.vector.extend(embeddings[1])

    resource.add_vectors(
        "body",
        FieldType.TEXT,
        [vector],
    )

    resource.sync_commit()

def get_question_text(data):
    return f"{data[1]}<br\><br\>{data[2]}"

with open('./downloads/results.csv', "r") as reader:
    csvFile = csv.reader(reader)
    count = 0
    for line in csvFile:
        title = line[0]
        text = get_question_text(line)
        count +=1
        print(f"Uploading {count}: {title}")
        upload_question(title, text)