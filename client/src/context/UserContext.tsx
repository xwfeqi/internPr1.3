import React, { createContext, useContext, ReactNode } from 'react';
import Store from '../store/store';

interface UserContextProps {
    store: Store;
}

const UserContext = createContext<UserContextProps | null>(null);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const store = new Store();
    return (
        <UserContext.Provider value={{ store }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context.store;
};
