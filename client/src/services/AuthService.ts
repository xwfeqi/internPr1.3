import axios from 'axios';
import { AuthResponse } from '../models/response/AuthResponse';
import { API_URL } from '../http';

class AuthService {
    async login(email: string, password: string) {
        const response = await axios.post(`${API_URL}/login`, { email, password }, { withCredentials: true });
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        return response.data;
    }

    async registration(name: string, email: string, password: string) {
        const response = await axios.post(`${API_URL}/registration`, { name, email, password }, { withCredentials: true });
        return response.data;
    }

    async logout() {
        const response = await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return response;
    }

    async refresh() {
        const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, { withCredentials: true });
        return response;
    }
}

export default new AuthService();
