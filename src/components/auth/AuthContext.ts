import {createContext, useContext} from "react";


// user type definition
export type UserType = {
  name : string
  email : string
  avatar ?: string
  id : string
  isEmailVerified : boolean
  role : string
}

// session type definition
export type SessionType = {
  uid: string
  expires: number | undefined
  token: string
}

export type RegisterValuesType = {
  name : string;
  email : string;
  password : string;
}

// login callback type definition
export type LoginCallback = (email: string, password: string) => Promise<UserType>;
export type LogoutCallback = () => Promise<void>;
export type RegisterCallback = (values : RegisterValuesType) => Promise<UserType>;
export type RenewCallback = () => Promise<void>;

// the context type definition
export type AuthContextType = {
  user ?: UserType
  session ?: SessionType
  pending : boolean
  login : LoginCallback
  logout : LogoutCallback
  register : RegisterCallback
  renew : RenewCallback
}

// the context
export const AuthContext = createContext<AuthContextType>({
  pending: true,
  login: () => new Promise<UserType>((resolve, reject) => reject('Not implemented')),
  logout: () => new Promise<void>((resolve, reject) => reject('Not implemented')),
  register: () => new Promise<UserType>((resolve, reject) => reject('Not implemented')),
  renew: () => new Promise<void>((resolve, reject) => reject('Not implemented')),
});

// the hook for the context
export const useAuth = () => useContext(AuthContext);
