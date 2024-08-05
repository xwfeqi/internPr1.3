export interface IUser {
    id: string;
    name: string;
    email: string;
    isActivated: boolean;
    registeredDate: string;
    activationLink?: string;
    studyDate: string; 
    role?: string;
}
