import { SERVER_URL } from "./config";
import axios from "axios";
import { useState } from "react";

export const useAuthentication = () => {
    const [refreshAttempted, setRefreshAttempted] = useState(false);

    const isAuthenticated = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            console.log('Access Token:', accessToken);

            if (!accessToken) {
                localStorage.setItem('authenticated', false);
                return false;
            }

            const response = await axios.get(`${SERVER_URL}/api/v1/user/get/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            console.log('Token is valid:', response);
            localStorage.setItem('authenticated', true);
            return true;
        } catch (error) {
            console.log('Token is invalid:', error);

            if (error.response && error.response.status === 401 && !refreshAttempted) {
                setRefreshAttempted(true); 

                try {
                    const refreshToken = localStorage.getItem('refreshToken');
                    const newAccessToken = await refreshAccessToken(refreshToken);

                    if (!newAccessToken) {
                        localStorage.setItem('authenticated', false);
                        return false;
                    }

                    const verificationResponse = await axios.get(`${SERVER_URL}/api/v1/user/get/`, {
                        headers: {
                            Authorization: `Bearer ${newAccessToken}`,
                        },
                    });

                    console.log('Token is valid after refresh:', verificationResponse);
                    localStorage.setItem('authenticated',true);
                    return true;
                } catch (refreshError) {
                    console.error('Error refreshing token:', refreshError);
                    localStorage.setItem('authenticated',false);
                    return false;
                }
            }

            localStorage.setItem('authenticated', false);
            return false;
        }
    };

    const refreshAccessToken = async (currentRefreshToken) => {
        try {
            const response = await axios.post(`${SERVER_URL}/api/token/refresh/`, {
                refresh: currentRefreshToken,
            });
            const newAccessToken = response.data.access;
            localStorage.setItem('accessToken', newAccessToken);
            return newAccessToken;
        } catch (error) {
            console.error('Error refreshing access token:', error);
            throw error;
        }
    };

    return { isAuthenticated };
};
