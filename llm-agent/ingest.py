from nuclia import sdk
import requests

auth = sdk.NucliaAuth()
auth.kb(
    url="https://europe-1.nuclia.cloud/api/v1/kb/<KB_ID>",
    token="<API_KEY>",
    interactive=False
)

nuclia_resources = sdk.NucliaResource()
wiki_titles = ["Toronto", "Seattle", "Chicago", "Boston", "Houston"]
for title in wiki_titles:
    response = requests.get(
        "https://en.wikipedia.org/w/api.php",
        params={
            "action": "query",
            "format": "json",
            "titles": title,
            "prop": "extracts",
            "explaintext": True,
        },
    ).json()
    page = next(iter(response["query"]["pages"].values()))
    wiki_text = page["extract"]
    wiki_id = page["pageid"]

    nuclia_resources.create(
        slug=wiki_id,
        icon="text/plain",
        texts={
            "wikipedia": {
                "body": wiki_text,
            }
        }
    )
