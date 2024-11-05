import { SERVER_URL } from "./config";
import axios from "axios";
import { useState } from "react";

export const useAuthentication = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const checkAuthentication = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            console.log('Access Token:', accessToken);

            if (!accessToken) {
                setIsAuthenticated(false);
                return false;
            }

            const response = await axios.post(`${SERVER_URL}/verify`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            console.log('Token is valid:', response);
            setIsAuthenticated(true);
            return true;
        } catch (error) {
            console.log('Token is invalid:', error);

            setIsAuthenticated(false);
            return false;
        }
    };

    // Function to handle user login
    const login = async (email, password) => {
        try {
            const response = await axios.post(`${SERVER_URL}/login`, {
                email,
                password,
            });

            const { token, user } = response.data;

            localStorage.setItem('accessToken', token);
            localStorage.setItem('user', JSON.stringify(user));
            setIsAuthenticated(true);

            console.log('Login successful:', response.data);
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            setIsAuthenticated(false);
            return false;
        }
    };


    return { isAuthenticated: checkAuthentication, login };
};
