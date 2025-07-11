export interface Login {
    email: string;
    password: string;
}

export interface Register {

    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role?: string;
}

export interface CreateUser {
    id?: number;
    name: string;
    email: string;
    password?: string;
    role?: string;
}

export interface RoleData{
  permissions?: number[];
  roleName?: string;
}


export type UserFields = 'id' | 'name' | 'email'| 'role' | 'password';