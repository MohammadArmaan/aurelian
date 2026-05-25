import server from "../dist/server/server.js";

function nodeRequestToWebRequest(req: any) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const { method, headers } = req;
  const requestInit: RequestInit = {
    method,
    headers,
  };
  if (method !== "GET" && method !== "HEAD") {
    requestInit.body = req;
  }
  return new Request(url.toString(), requestInit);
}

export default async function handler(req: any, res: any) {
  try {
    const request = nodeRequestToWebRequest(req);
    const response = await server.fetch(request, undefined, undefined);

    res.status(response.status);
    response.headers.forEach((value, name) => {
      res.setHeader(name, value);
    });

    const body = await response.arrayBuffer();
    if (body.byteLength > 0) {
      res.send(Buffer.from(body));
    } else {
      res.end();
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}
