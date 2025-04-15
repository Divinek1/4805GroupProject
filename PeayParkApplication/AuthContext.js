/*
This is the AuthContext.js file. It takes care of user sessions and allows the user to stay logged in even after closing
the application. They will stay logged in until they navigate to SettingsPage.js and log out. This file was created with
the help of BlackBox.ai. It was used to help fix the bugs in this file and tell us what import was the best to use and,
most importantly, how to use the component AsyncStorage. It also includes error checking.
 */
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // This checks for a stored session when the application is opened by a user.
        checkUser();

        // Listen for any changes in the authorization state (such as logout)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser(session.user);
                AsyncStorage.setItem('supabase.session', JSON.stringify(session));
            } else {
                setUser(null);
                AsyncStorage.removeItem('supabase.session');
            }
        });

        return () => {
            if (subscription) subscription.unsubscribe();
        };
    }, []);

    async function checkUser() {
        try {
            // Check AsyncStorage for existing session
            const sessionStr = await AsyncStorage.getItem('supabase.session');
            if (sessionStr) {
                const session = JSON.parse(sessionStr);
                setUser(session.user);

                // Verify session is still valid with Supabase
                const { data: { user: currentUser } } = await supabase.auth.getUser();
                if (currentUser) {
                    setUser(currentUser);
                }
            }
        } catch (error) {
            console.error('Error checking user session:', error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
