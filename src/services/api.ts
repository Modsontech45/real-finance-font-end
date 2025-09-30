const API_BASE_URL = "https://finance-rgg0.onrender.com/api"; //|| 'http://localhost:3000/api';
// const API_BASE_URL = 'http://localhost:3000/api';
// API client configuration
class ApiClient {
  private baseURL: string;
  private _token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    // Initialize token from localStorage on startup
    this._token = localStorage.getItem("authToken");
  }

  setToken(token: string) {
    this._token = token;
    localStorage.setItem("authToken", token);
  }

  clearToken() {
    this._token = null;
    localStorage.removeItem("authToken");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        ...(this._token && { Authorization: `Bearer ${this._token}` }),
        ...options.headers,
      },
      // credentials: 'include',
      ...options,
    };

    try {
      const response = await fetch(url, config);
      console.log(response);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log(errorData);

        // check if error data is array of errors
        if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          throw new Error(errorData.errors[0].message);
        }
        throw new Error(
          errorData.errors || errorData.error || `HTTP error! status: ${response.status}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  // File upload
  async uploadFile<T>(endpoint: string, formData: FormData): Promise<T> {
    const config: RequestInit = {
      method: "POST",
      headers: {
        ...(this._token && { Authorization: `Bearer ${this._token}` }),
      },
      credentials: "include",
      body: formData,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`,
      );
    }

    return await response.json();
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
