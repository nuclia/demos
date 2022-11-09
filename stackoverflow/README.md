# Indexing StackOverflow questions/answers in NucliaDB

## Start NucliaDB

```bash
docker run -it \
       -e LOG=INFO \
       -p 8080:8080 \
       -p 8060:8060 \
       -p 8040:8040 \
       -v nucliadb-standalone:/data \
       nuclia/nucliadb:latest
```

## Install dependencies

```bash
pyenv acticate demo
pip install -r requirements.txt
```

## Get StackOverflow data

Go to Philosophy StackExchange and download the data from [here](https://data.stackexchange.com/philosophy/queries).

```sql
SELECT q.Title, '__1__', q.Body, '__2__', (SELECT a.Body FROM Posts a WHERE a.ParentId=q.id FOR XML PATH('')
), '__3__'
FROM Posts q
WHERE PostTypeId=1
```

Then convert it to make a proper CSV file:

```bash
python format_csv.py
```

## Import data into NucliaDB

```bash
python upload.py
```

## Default frontend

http://localhost:8080/widget/

### Run the proxy

The proxy will extract the `query` from any `/search` request, in order to convert it to a vector and pass it to NucliaDB.

```bash
cd proxy
uvicorn main:app
```

### Run demo frontend

```bash
cd dist/search-widget-demo
python3 -m http.server 4200
```
