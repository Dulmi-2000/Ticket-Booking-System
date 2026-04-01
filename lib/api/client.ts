const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8081"

export async function backendFetch(
  path: string,
  options?: RequestInit & { token?: string }
): Promise<Response> {
  const url = `${BACKEND_URL}${path}`
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string> || {}),
  }

  if (options?.token) {
    headers["Authorization"] = `Bearer ${options.token}`
  }

  const res = await fetch(url, {
    ...options,
    headers,
  })

  return res
}

export async function backendGet<T>(path: string, token?: string): Promise<T> {
  const res = await backendFetch(path, { method: "GET", token })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(error.message || `Backend error: ${res.status}`)
  }
  return res.json()
}

export async function backendPost<T>(path: string, body: unknown, token?: string): Promise<T> {
  const res = await backendFetch(path, {
    method: "POST",
    body: JSON.stringify(body),
    token,
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(error.message || `Backend error: ${res.status}`)
  }
  return res.json()
}

export async function backendPut<T>(path: string, body: unknown, token?: string): Promise<T> {
  const res = await backendFetch(path, {
    method: "PUT",
    body: JSON.stringify(body),
    token,
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(error.message || `Backend error: ${res.status}`)
  }
  return res.json()
}

export async function backendDelete(path: string, token?: string): Promise<void> {
  const res = await backendFetch(path, { method: "DELETE", token })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }))
    throw new Error(error.message || `Backend error: ${res.status}`)
  }
}
