const RESEND_API_BASE_URL = "https://api.resend.com";

function resolvePathSegments(req) {
  const fromQuery = req.query?.path;

  if (Array.isArray(fromQuery) && fromQuery.length > 0) {
    return fromQuery;
  }

  if (typeof fromQuery === "string" && fromQuery.trim().length > 0) {
    return fromQuery;
  }

  const rawUrl = typeof req.url === "string" ? req.url : "";
  const pathWithoutQuery = rawUrl.split("?")[0] || "";
  const match = pathWithoutQuery.match(/^\/?api\/resend\/?(.*)$/);
  const derivedPath = match?.[1]?.trim();

  if (!derivedPath) {
    return "";
  }

  return derivedPath.split("/").filter(Boolean);
}

function buildTargetUrl(pathSegments, query) {
  const path = Array.isArray(pathSegments) ? pathSegments.join("/") : pathSegments || "";

  if (!path) {
    return null;
  }

  const target = new URL(`${RESEND_API_BASE_URL}/${path}`);

  Object.entries(query).forEach(([key, value]) => {
    if (key === "path" || value == null) {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => target.searchParams.append(key, String(item)));
      return;
    }

    target.searchParams.set(key, String(value));
  });

  return target;
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Allow", "GET,POST,OPTIONS");
    res.status(204).end();
    return;
  }

  const authorization = process.env.RESEND_API_KEY
    ? `Bearer ${process.env.RESEND_API_KEY}`
    : req.headers.authorization;

  if (!authorization) {
    res.status(401).json({
      message: "No Resend API key is available for the proxy request.",
    });
    return;
  }

  const resolvedPath = resolvePathSegments(req);
  const target = buildTargetUrl(resolvedPath, req.query);

  if (!target) {
    res.status(404).json({
      message: `Missing Resend proxy path for ${req.url || "/api/resend"}.`,
    });
    return;
  }

  const headers = {
    Authorization: authorization,
    Accept: req.headers.accept || "application/json",
  };

  if (req.headers["content-type"]) {
    headers["Content-Type"] = req.headers["content-type"];
  }

  let body;

  if (req.method !== "GET" && req.method !== "HEAD" && req.body != null) {
    body =
      typeof req.body === "string" || Buffer.isBuffer(req.body) ? req.body : JSON.stringify(req.body);
  }

  const response = await fetch(target, {
    method: req.method,
    headers,
    body,
  });

  const payload = await response.text();
  const contentType = response.headers.get("content-type") || "application/json; charset=utf-8";

  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", contentType);
  res.status(response.status).send(payload);
}
