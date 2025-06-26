import { useState, useEffect } from 'react';
import UserContext from './UserContext';
import { fetchUserProfile } from '../api/profile';

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadProfile = async () => {
            const token = localStorage.getItem("accessToken");
            if (!token) return;
            try {
                const data = await fetchUserProfile();
                setUser(data);
            } catch (error) {
                console.error("Error fetching user profile:", error.message);
            }
        };
        loadProfile();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
