const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://flight-hdgcc9ezcea3eaad.centralindia-01.azurewebsites.net/api').replace(/\/$/, '');

const buildUrl = (endpoint: string) => `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

export const apiClient = {
  async get(endpoint: string) {
    const response = await fetch(buildUrl(endpoint));
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return response.json();
  },

  async post(endpoint: string, data: unknown) {
    const response = await fetch(buildUrl(endpoint), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return response.json();
  },

  async put(endpoint: string, data: unknown) {
    const response = await fetch(buildUrl(endpoint), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return response.json();
  },

  async patch(endpoint: string, data: unknown) {
    const response = await fetch(buildUrl(endpoint), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return response.json();
  },

  async delete(endpoint: string) {
    const response = await fetch(buildUrl(endpoint), {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    return response.ok;
  },
};
