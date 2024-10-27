import { Request as FunctionRequest, Response } from "firebase-functions/v1";
import { Hono } from "hono";

export const handler = (app: Hono<any>) => {
  return async (req: FunctionRequest, resp: Response) => {
    const url = new URL(`${req.protocol}://${req.hostname}${req.url}`);

    const headers = new Headers();

    // biome-ignore lint/complexity/noForEach: <explanation>
    Object.keys(req.headers).forEach((k) => {
      headers.set(k, req.headers[k] as string);
    });
    const body = req.body;

    const newRequest = ["GET", "HEAD"].includes(req.method)
      ? new Request(url, {
          headers,
          method: req.method,
        })
      : new Request(url, {
          headers,
          method: req.method,
          body: Buffer.from(
            typeof body === "string" ? body : JSON.stringify(body || {})
          ),
        });
    const res = await app.fetch(newRequest);

    const contentType = res.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      resp.json(await res.json());
    } else {
      resp.send(await res.text());
    }
  };
};
