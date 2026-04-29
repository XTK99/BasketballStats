/**
 * Clean fetch wrapper
 *
 * Usage:
 * apiFetch('/markets')
 * apiFetch('/markets', { category: 'Sports', status: 'open' })
 * apiFetch('/markets', { status: 'open' }, { method: 'POST', body: {...} })
 */

/**
 * apiFetch usage:
 * apiFetch({ baseUrl: 'https://api.com', endpoint: '/markets' })
 * apiFetch({ baseUrl, endpoint, urlParams, options })
 */

async function apiFetch({ baseUrl, endpoint, urlParams = {}, options = {} }) {
  const {
    method = "GET",
    headers = {},
    body = null,
    timeout = 15000,
    credentials = "include", // useful if cookies/session auth
    signal = null,
    responseType = "json", // json | text | blob | raw
  } = options;

  // Build URL
  if (!baseUrl) {
    throw new Error("baseUrl is required");
  }
  const url = new URL(endpoint, baseUrl);

  Object.entries(urlParams).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.append(key, value);
    }
  });

  // Abort controller for timeout
  const controller = new AbortController();
  const activeSignal = signal || controller.signal;

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const fetchOptions = {
      method,
      credentials,
      signal: activeSignal,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };

    if (body && method !== "GET") {
      fetchOptions.body =
        typeof body === "string" ? body : JSON.stringify(body);
    }

    const response = await fetch(url.toString(), fetchOptions);

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorPayload = null;

      try {
        errorPayload = await response.json();
      } catch {
        errorPayload = await response.text();
      }

      throw {
        status: response.status,
        statusText: response.statusText,
        data: errorPayload,
      };
    }

    // Parse response
    switch (responseType) {
      case "text":
        return await response.text();

      case "blob":
        return await response.blob();

      case "raw":
        return response;

      case "json":
      default:
        return await response.json();
    }
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Request timed out");
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}
