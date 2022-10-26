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

```sql
-- // the __x__ markers allow to delimit HTML contents as they contains newline characters that break the CSV format
SELECT q.Title, '__1__', q.Body as question, '__2__', a.Body as answer, '__3__'
FROM Posts a, Posts q, PostTags pt, Tags t
WHERE a.ParentId=q.Id
AND q.Id=pt.PostId
AND t.id = pt.TagId
AND t.TagName='css'
ORDER BY a.score DESC
```

Then convert it to make a proper CSV file:

```bash
python format_csv.py
```

## Import data into NucliaDB

```bash
python upload.py
```

## Play with it

http://localhost:8080/widget
