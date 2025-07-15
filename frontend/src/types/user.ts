export interface User {
    id: number;
    name: string;
    email: string;
    roleName?: string;
}

export interface Permission {
    name: string;
    id: number
}
