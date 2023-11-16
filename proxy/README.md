# Proxy

If your Knowledge Box is private, you need an API key to access it.

But you don't want to expose your API key to the world. So you can not put it in your widget HTML snippet, or in your client-side JavaScript code.

Instead, you can use a proxy to access your Knowledge Box on Nuclia cloud. The proxy will add your API key to the request, and forward it to Nuclia cloud.

Here is an example done with Nginx.

## Setup

- Install Docker
- Generate an API key on https://nuclia.cloud (see https://docs.nuclia.dev/docs/guides/getting-started/quick-start/push#get-an-api-key)
- Modify `nginx.conf` to replace `<YOUR_API_KEY>` with your API key
- Run your Nginx server:

```bash
docker run -it --rm -v "$PWD/nginx.conf:/etc/nginx/conf.d/default.conf" -p 8000:8000 nginx
```

## Widget

You can let the Nuclia widget use your proxy by setting the `proxy` option and indicating the URL of your proxy:

```html
<nuclia-search-bar
  knowledgebox="<YOUR_KNOWLEDGEBOX_ID>"
  backend="http://0.0.0.0:8000/api"
  proxy="true"
  features="permalink"
></nuclia-search-bar>
```

Note:

When using a proxy, do not set:

- the `private` option,
- the `zone` option.
  They are not needed in that case.

## SDK

You can also use the SDK with your proxy:

```js
import { Nuclia } from '@nuclia/core';

const nuclia = new Nuclia({
  knowledgebox: '<YOUR_KNOWLEDGEBOX_ID>,
  backend: 'http://0.0.0.0:8000/api',
  proxy: true,
});
```
