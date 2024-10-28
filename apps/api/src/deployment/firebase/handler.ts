// @ts-nocheck
import { Request as FunctionRequest } from "firebase-functions/v2/https";
import { Hono } from "hono";

interface RequestBody {
  [key: string]: any;
}

interface CookieMap {
  [key: string]: string;
}

class RequestAdapter {
  private url: URL;
  private headers: Headers;
  private method: string;
  private body?: any;

  constructor(firebaseReq: any) {
    this.method = firebaseReq.method;
    console.log(`[RequestAdapter] Processing ${this.method} request`);
    console.log('[RequestAdapter] Request headers:', firebaseReq.headers);
    console.log('[RequestAdapter] Request body:', firebaseReq.body);
    console.log('[RequestAdapter] Raw body exists:', !!firebaseReq.rawBody);

    this.initializeUrl(firebaseReq);
    this.initializeHeaders(firebaseReq);
    this.initializeBody(firebaseReq);
  }

  private initializeUrl(firebaseReq: any): void {
    try {
      this.url = new URL(
        firebaseReq.url,
        `${firebaseReq.protocol}://${firebaseReq.hostname}`
      );
      console.log('[RequestAdapter] Constructed URL:', this.url.toString());
    } catch (error) {
      console.error('[RequestAdapter] Error constructing URL:', {
        url: firebaseReq.url,
        protocol: firebaseReq.protocol,
        hostname: firebaseReq.hostname,
        error: error.message
      });
      throw error;
    }
  }

  private initializeHeaders(firebaseReq: any): void {
    try {
      this.headers = new Headers();
      
      console.log('[RequestAdapter] Original headers:', firebaseReq.headers);
      
      // Add regular headers
      Object.entries(firebaseReq.headers).forEach(([key, value]) => {
        if (value) {
          this.headers.append(key, value);
          console.log(`[RequestAdapter] Added header: ${key}=${value}`);
        }
      });

      // Handle cookies
      this.addCookiesToHeaders(firebaseReq.cookies);
      
      console.log('[RequestAdapter] Final headers:', Object.fromEntries(this.headers.entries()));
    } catch (error) {
      console.error('[RequestAdapter] Error initializing headers:', error);
      throw error;
    }
  }

  private addCookiesToHeaders(cookies: CookieMap): void {
    try {
      if (cookies && Object.keys(cookies).length > 0) {
        console.log('[RequestAdapter] Processing cookies:', cookies);
        const cookieString = Object.entries(cookies)
          .map(([key, value]) => `${key}=${value}`)
          .join("; ");
        this.headers.append("Cookie", cookieString);
        console.log('[RequestAdapter] Added cookie header:', cookieString);
      } else {
        console.log('[RequestAdapter] No cookies to process');
      }
    } catch (error) {
      console.error('[RequestAdapter] Error adding cookies to headers:', error);
      throw error;
    }
  }

  private initializeBody(firebaseReq: any): void {
    try {
      if (["GET", "HEAD"].includes(this.method)) {
        console.log('[RequestAdapter] No body needed for', this.method);
        return;
      }

      const contentType = firebaseReq.headers["content-type"];
      console.log('[RequestAdapter] Processing body with content-type:', contentType);
      
      this.body = this.parseRequestBody(firebaseReq, contentType);
      console.log('[RequestAdapter] Parsed body type:', typeof this.body);
      console.log('[RequestAdapter] Body is FormData:', this.body instanceof FormData);
    } catch (error) {
      console.error('[RequestAdapter] Error initializing body:', error);
      throw error;
    }
  }

  private parseRequestBody(firebaseReq: any, contentType: string | undefined): any {
    try {
      console.log('[RequestAdapter] Parsing body for content-type:', contentType);
      
      if (!contentType) {
        console.log('[RequestAdapter] No content-type, stringifying body');
        return JSON.stringify(firebaseReq.body);
      }

      if (contentType.includes("application/json")) {
        console.log('[RequestAdapter] Parsing JSON body');
        return JSON.stringify(firebaseReq.body);
      }

      if (contentType.includes("application/x-www-form-urlencoded")) {
        console.log('[RequestAdapter] Parsing URL-encoded body');
        return new URLSearchParams(firebaseReq.body).toString();
      }

      if (contentType.includes("multipart/form-data")) {
        console.log('[RequestAdapter] Creating FormData');
        const formData = new FormData();
        Object.entries(firebaseReq.body).forEach(([key, value]) => {
          formData.append(key, value);
          console.log(`[RequestAdapter] Added form field: ${key}`);
        });
        return formData;
      }

      console.log('[RequestAdapter] Using raw body');
      return firebaseReq.rawBody;
    } catch (error) {
      console.error('[RequestAdapter] Error parsing request body:', error);
      throw error;
    }
  }

  toWebRequest(): Request {
    try {
      const request = new Request(this.url, {
        method: this.method,
        headers: this.headers,
        body: this.body,
      });
      console.log('[RequestAdapter] Created Web Request:', {
        url: request.url,
        method: request.method,
        headers: Object.fromEntries(request.headers.entries()),
        bodyType: typeof this.body
      });
      return request;
    } catch (error) {
      console.error('[RequestAdapter] Error creating Web Request:', error);
      throw error;
    }
  }
}

class ResponseAdapter {
  private firebaseRes: any;

  constructor(firebaseRes: any) {
    this.firebaseRes = firebaseRes;
    console.log('[ResponseAdapter] Initialized');
  }

  async adapt(honoResponse: Response): Promise<void> {
    try {
      console.log('[ResponseAdapter] Processing response:', {
        status: honoResponse.status,
        headers: Object.fromEntries(honoResponse.headers.entries())
      });

      this.setStatus(honoResponse);
      this.setHeaders(honoResponse);
      await this.setBody(honoResponse);
    } catch (error) {
      console.error('[ResponseAdapter] Error adapting response:', error);
      throw error;
    }
  }

  private setStatus(honoResponse: Response): void {
    console.log('[ResponseAdapter] Setting status:', honoResponse.status);
    this.firebaseRes.status(honoResponse.status);
  }

  private setHeaders(honoResponse: Response): void {
    try {
      const cookieHeaders: string[] = [];
      console.log('[ResponseAdapter] Processing response headers');

      for (const [key, value] of honoResponse.headers.entries()) {
        if (key.toLowerCase() === "set-cookie") {
          cookieHeaders.push(value);
          console.log('[ResponseAdapter] Found Set-Cookie header:', value);
        } else {
          this.firebaseRes.set(key, value);
          console.log(`[ResponseAdapter] Set header: ${key}=${value}`);
        }
      }

      if (cookieHeaders.length > 0) {
        this.firebaseRes.set("Set-Cookie", cookieHeaders);
        console.log('[ResponseAdapter] Set multiple cookies:', cookieHeaders);
      }
    } catch (error) {
      console.error('[ResponseAdapter] Error setting headers:', error);
      throw error;
    }
  }

  private async setBody(honoResponse: Response): Promise<void> {
    try {
      const contentType = honoResponse.headers.get("content-type");
      console.log('[ResponseAdapter] Processing body with content-type:', contentType);

      if (!contentType) {
        await this.handleNoContentType(honoResponse);
        return;
      }

      if (contentType.includes("application/json")) {
        const jsonData = await honoResponse.json();
        console.log('[ResponseAdapter] Sending JSON response:', jsonData);
        this.firebaseRes.json(jsonData);
        return;
      }

      if (contentType.includes("text/")) {
        const textData = await honoResponse.text();
        console.log('[ResponseAdapter] Sending text response, length:', textData.length);
        this.firebaseRes.send(textData);
        return;
      }

      if (contentType.includes("application/octet-stream")) {
        const buffer = await honoResponse.arrayBuffer();
        console.log('[ResponseAdapter] Sending binary response, size:', buffer.byteLength);
        this.firebaseRes.send(Buffer.from(buffer));
        return;
      }

      if (this.isFormData(contentType)) {
        await this.handleFormData(honoResponse);
        return;
      }

      const buffer = await honoResponse.arrayBuffer();
      console.log('[ResponseAdapter] Sending default buffer response, size:', buffer.byteLength);
      this.firebaseRes.send(Buffer.from(buffer));

    } catch (error) {
      console.error('[ResponseAdapter] Error processing response body:', error);
      throw error;
    }
  }

  private async handleNoContentType(honoResponse: Response): Promise<void> {
    try {
      console.log('[ResponseAdapter] Handling response with no content-type');
      try {
        const jsonData = await honoResponse.json();
        console.log('[ResponseAdapter] Successfully parsed as JSON');
        this.firebaseRes.json(jsonData);
      } catch (error) {
        console.log('[ResponseAdapter] Not JSON, falling back to text');
        const textData = await honoResponse.text();
        this.firebaseRes.send(textData);
      }
    } catch (error) {
      console.error('[ResponseAdapter] Error handling no content-type:', error);
      throw error;
    }
  }

  private isFormData(contentType: string): boolean {
    return (
      contentType.includes("multipart/form-data") ||
      contentType.includes("application/x-www-form-urlencoded")
    );
  }

  private async handleFormData(honoResponse: Response): Promise<void> {
    try {
      console.log('[ResponseAdapter] Handling form data response');
      const formData = await honoResponse.formData();
      const formDataObject: Record<string, string | File> = {};
      formData.forEach((value, key) => {
        formDataObject[key] = value;
        console.log(`[ResponseAdapter] Processed form field: ${key}`);
      });
      console.log('[ResponseAdapter] Sending form data response');
      this.firebaseRes.send(formDataObject);
    } catch (error) {
      console.error('[ResponseAdapter] Error handling form data:', error);
      throw error;
    }
  }
}

export const handler = (app: Hono<any>) => {
  return async (firebaseReq: any, firebaseRes: any) => {
    console.log('=== Starting Firebase-Hono Request Handler ===');
    console.log('Initial request details:', {
      method: firebaseReq.method,
      url: firebaseReq.url,
      headers: firebaseReq.headers
    });

    try {
      const requestAdapter = new RequestAdapter(firebaseReq);
      const webRequest = requestAdapter.toWebRequest();
      
      console.log('Sending request to Hono app');
      const honoResponse = await app.fetch(webRequest);
      console.log('Received response from Hono app:', {
        status: honoResponse.status,
        headers: Object.fromEntries(honoResponse.headers.entries())
      });
      
      const responseAdapter = new ResponseAdapter(firebaseRes);
      await responseAdapter.adapt(honoResponse);
      
      console.log('=== Request Handler Completed Successfully ===');

    } catch (error) {
      console.error('=== Error in Request Handler ===');
      console.error('Full error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      firebaseRes.status(500).json({
        error: "Internal server error",
        message: error.message,
        timestamp: new Date().toISOString(),
        requestInfo: {
          method: firebaseReq.method,
          url: firebaseReq.url,
          headers: firebaseReq.headers
        }
      });
    }
  };
};
