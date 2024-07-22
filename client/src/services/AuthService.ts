import axios from 'axios';
import { AuthResponse } from '../models/response/AuthResponse';
import { API_URL } from '../http';

export default class AuthService {
    static async login(email: string, password: string) {
        return axios.post<AuthResponse>(`${API_URL}/login`, { email, password });
    }

    static async registration(name: string, email: string, password: string) {
        return axios.post<AuthResponse>(`${API_URL}/registration`, { name, email, password });
    }

    static async logout() {
        return axios.post(`${API_URL}/logout`);
    }
}
