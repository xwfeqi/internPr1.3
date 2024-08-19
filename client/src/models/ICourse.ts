export interface ICourse {
    _id: string; 
    name: string;
    description?: string;
    type: 'active' | 'upcoming' | 'finished';
    userStudyDate?: string;
}