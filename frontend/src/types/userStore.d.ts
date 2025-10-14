import {User}   from "../types/user.d"
type SignupPayload = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

type LoginPayload = {
    email:string;
    password:string;
};
export interface UserStore {
    user:User | null,
    loading:boolean,
    checkingAuth:boolean,
    login : (payload: LoginPayload) => Promise<void>;
    checkAuth : () => Promise<void>;
    logout : () => Promise<void>;
    signup: ({ name, email, password, confirmPassword }: SignupPayload) => void;
    refreshToken: () => Promise<string>;

}