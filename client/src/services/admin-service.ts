import axios from 'axios';
import { IUser } from '../models/IUser';

const API_URL = '/api/admin';

export const fetchStudents = async (
    page: number, 
    limit: number, 
    sortBy: string, 
    order: 'asc' | 'desc', 
    search: string
): Promise<{ students: IUser[], totalPages: number, currentPage: number }> => {
    const response = await axios.get(`${API_URL}/students`, {
        params: { page, limit, sortBy, order, search }
    });
    return response.data;
};

export const updateStudent = async (
    id: string, 
    studentData: Partial<IUser>
): Promise<IUser> => {
    const response = await axios.put(`${API_URL}/students/${id}`, studentData);
    return response.data;
};
