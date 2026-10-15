const api = async (path, options = {}) => {
  const response = await fetch(path, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const isJson = response.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await response.json() : await response.text()

  if (!response.ok) {
    throw new Error(typeof data === 'string' ? data : data.message || 'Request failed')
  }

  return data
}

export default api
