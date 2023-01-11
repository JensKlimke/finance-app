import React, {createContext, useContext} from "react";
import {defaultContext, EntryContextType, GenericEntryProvider} from "../../hooks/entry";

export type UserType = {
  id?: string
  name: string
  email: string
  isEmailVerified?: boolean
  role: string
}

export const defaultUser = () => ({
  name: '',
  email: '',
  role: ''
});

export const cleanUserCopy = (user: UserType) => ({
  name: user.name,
  email: user.email,
  role: user.role,
})


export const UserContext = createContext<EntryContextType<UserType>>(defaultContext);
export const useUsers = () => useContext(UserContext);

const UserProvider = GenericEntryProvider<UserType>('users',
  cleanUserCopy,
  defaultUser,
  (context : EntryContextType<UserType>, children : React.ReactNode) => (
    <UserContext.Provider value={context}>
      {children}
    </UserContext.Provider>
  ), undefined, {'limit': '100'});

export default UserProvider;
