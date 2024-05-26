import http from 'http';
import { routes } from './routes.js';
import { json } from './middlewares/json.js';
import { extractQueryParams } from './utils/extract-query-params.js';

const server = http.createServer(async (request, response) => {
  const { method, url } = request;

  await json(request, response);

  const route = routes.find(route => route.method === method && route.path.test(url));

  if(route) {
    const routeParams = request.url.match(route.path).groups;

    const { query, ...params } = routeParams;

    request.query = query ? extractQueryParams(query) : {};
    request.params = params;

    return route.handler(request, response);
  }

  return response.writeHead(404).end();
});

server.listen(3000);