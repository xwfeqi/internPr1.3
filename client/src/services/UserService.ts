import axios from 'axios';
import { AuthResponse } from '../models/response/AuthResponse';
import { API_URL } from '../http';

class UserService {
    async register(userData: any) {
        try {
            const response = await axios.post<AuthResponse>(`${API_URL}/registration`, userData, { withCredentials: true });
            return response;
        } catch (error) {
            this.handleError(error);
        }
    }

    async login(email: string, password: string) {
        try {
            const response = await axios.post<AuthResponse>(`${API_URL}/login`, { email, password }, { withCredentials: true });
            return response;
        } catch (error) {
            this.handleError(error);
        }
    }

    async logout() {
        try {
            const response = await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
            return response;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getProfile() {
        try {
            const response = await axios.get(`${API_URL}/profile`, { withCredentials: true });
            return response;
        } catch (error) {
            this.handleError(error);
        }
    }

    async activate(link: string) {
        try {
            const response = await axios.get(`${API_URL}/activate/${link}`, { withCredentials: true });
            return response;
        } catch (error) {
            this.handleError(error);
        }
    }

    private handleError(error: unknown): never {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(error.response.data.message || 'An error occurred');
        } else {
            throw new Error('An unknown error occurred');
        }
    }
}

const userServiceInstance = new UserService();
export default userServiceInstance;
