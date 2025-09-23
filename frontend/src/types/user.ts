export interface User {
    id: number;
    name: string;
    email: string;
    role?: string;
}

export interface Permission {
    name: string;
    id: number
}
