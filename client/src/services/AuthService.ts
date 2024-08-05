import axios from "axios";
import { AuthResponse } from "../models/response/AuthResponse";
import { API_URL } from "../http";

class AuthService {
  async login(email: string, password: string) {
    try {
      const response = await axios.post(
        `${API_URL}/login`,
        { email, password },
        { withCredentials: true }
      );
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async registration(name: string, email: string, password: string) {
    try {
      const response = await axios.post(
        `${API_URL}/registration`,
        { name, email, password },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async logout() {
    try {
      const response = await axios.post(
        `${API_URL}/logout`,
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return response;
    } catch (error) {
      this.handleError(error);
    }
  }

  async refresh() {
    try {
      const response = await axios.post<AuthResponse>(
        `${API_URL}/refresh`,
        {},
        { withCredentials: true }
      );
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
  private handleError(error: unknown): never {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.message || "An error occurred");
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}

export default new AuthService();
