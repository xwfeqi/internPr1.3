export interface ICourse {
    _id: string; 
    name: string;
    lastname: string;
    description?: string;
    type: 'active' | 'upcoming' | 'finished';
    studyDates: Array<{
        userId: string;
        studyDate: string;
    }>;
}