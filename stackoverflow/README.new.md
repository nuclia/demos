# Indexing StackOverflow questions/answers in NucliaDB

## Start NucliaDB

```bash
docker run --rm -it \
       -e LOG=INFO \
       -p 8080:8080 \
       -p 8060:8060 \
       -p 8040:8040 \
       -v nucliadb-local:/data \
       nuclia/nucliadb:latest
```

### Run the proxy

The proxy will extract the `query` from any `/search` request, in order to convert it to a vector and pass it to NucliaDB.

```bash
pyenv activate demo
cd proxy
uvicorn main:app
```

### Run demo frontend

```bash
cd dist/pynconfr
python3 -m http.server 4201
```

Go to http://127.0.0.1:4201/
