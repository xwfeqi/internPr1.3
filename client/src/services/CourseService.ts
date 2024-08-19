import axios from "axios";

import { ICourse } from '../models/ICourse';

export const fetchCourses = async (): Promise<ICourse[]> => {
    const response = await axios.get('/api/courses');
    return response.data;
};
