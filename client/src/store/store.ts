import { IUser } from "../models/IUser";
import { makeAutoObservable } from "mobx";
import AuthService from "../services/AuthService";
import axios from 'axios';
import { AuthResponse } from "../models/response/AuthResponse";
import { API_URL } from "../http";
import { runInAction } from "mobx";

export default class Store {
    user = {} as IUser;
    isAuth = false;
    isLoading = false;

    constructor() {
        makeAutoObservable(this);
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setUser(user: IUser) {
        this.user = user;
    }

    setLoading(bool: boolean) {
        this.isLoading = bool;
    }

    async login(email: string, password: string) {
        try {
            const response = await AuthService.login(email, password);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            if (e instanceof Error) {
                console.log((e as any).response?.data?.message);
            } else {
                console.log("An unknown error occurred");
            }
        }
    }

    async register(name: string, email: string, password: string) {
        try {
            const response = await AuthService.registration(name, email, password);
            localStorage.setItem('token', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            if (e instanceof Error) {
                console.log((e as any).response?.data?.message);
            } else {
                console.log("An unknown error occurred");
            }
        }
    }

    async logout() {
        try {
            await AuthService.logout();
            localStorage.removeItem('token');
            this.setAuth(false);
            this.setUser({} as IUser);
        } catch (e) {
            if (e instanceof Error) {
                console.log((e as any).response?.data?.message);
            } else {
                console.log("An unknown error occurred");
            }
        }
    }

    async checkAuth() {
        this.setLoading(true);
        try {
            const response = await axios.get<AuthResponse>(`${API_URL}/refresh`, { withCredentials: true });
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('refreshToken', response.data.refreshToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            if (e instanceof Error) {
                console.log((e as any).response?.data?.message);
            } else {
                console.log("An unknown error occurred");
            }
        } finally {
            this.setLoading(false);
        }
    }

    async fetchUserProfile() {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }
    
            const response = await axios.get<IUser>(`${API_URL}/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            runInAction(() => {
                this.setUser(response.data);
            });
        } catch (e) {
            if (e instanceof Error) {
                console.log((e as any).response?.data?.message);
            } else {
                console.log("An unknown error occurred");
            }
        }
    }
    
    async refreshTokens() {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            this.logout();
            return;
        }
    
        try {
            const response = await axios.post<AuthResponse>(`${API_URL}/refresh`, { token: refreshToken });
            localStorage.setItem('accessToken', response.data.accessToken);
            this.setAuth(true);
            this.setUser(response.data.user);
        } catch (e) {
            this.logout();
        }
    }

    async setTokensFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('accessToken');
        const refreshToken = urlParams.get('refreshToken');

        if (accessToken && refreshToken) {
            localStorage.setItem('token', accessToken);
            this.setAuth(true);
            await this.fetchUserProfile();
        }
    }
}
