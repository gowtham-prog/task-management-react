import axios from "axios";
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthentication } from '../Authentication';
import Button from '../components/Button';
import InputField from '../components/inputField';
import Layout from '../components/layout';
import { SERVER_URL } from "../config";
import { googleLogout, useGoogleLogin } from '@react-oauth/google';


export default function Login() {
    const [authenticated, setAuthenticated] = useState(null);
    const { isAuthenticated } = useAuthentication();

    useEffect(() => {
        const checkAuthentication = async () => {
            const result = await isAuthenticated();
            setAuthenticated(result);
        };

        checkAuthentication();
    }, [isAuthenticated]);

    useEffect(() => {
        if (authenticated) {
            window.location.href = '/';
        }
    }, [authenticated]);

    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    // const { isAuthenticated } = useAuthentication();
    const location = useLocation();

    const logoutUser = async () => {
        localStorage.clear();
        sessionStorage.clear();
    };

    logoutUser().then(r => {
        
    })


    const handleUserLogin = (e) => {
        e.preventDefault();
        submitForm();
    };

    const submitForm = async () => {
        setErrorMessage("");
        setShowError(false);

        if (email === "" || password === "") {
            setErrorMessage("Enter valid username and password");
            setShowError(true);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('email', email);
            formData.append('password', password);

            await loginUser(formData);
        } catch (error) {
            setErrorMessage("Invalid username or password")
            setShowError(true)
        }
    };


    const loginUser = async (formData) => {
        try {
            const response = await axios.post(`${SERVER_URL}/login/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log("status:", response)
            const { token, user } = response.data;
            console.log('Access token received:', token);
            localStorage.clear();
            sessionStorage.clear();
            localStorage.setItem('accessToken', token);
            localStorage.setItem('user', user);
            isAuthenticated().then(r => {
            });
            
            if (location.state !== null) {
                navigate(location.state.path)
            } else {
                navigate("/");
            }
        } catch (error) {
            setErrorMessage("Invalid username or password")
            setShowError(true)
            throw error;
        }
    };

    const registerUser = async (formData) => {
        try {
            const response = await axios.post(`${SERVER_URL}/signup/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 201) {
                console.log('User registered successfully:', response.data);
            } else {
                setShowError(true)
                setErrorMessage("Unable to create an account.")
            }
        } catch (error) {
            console.error('Error while registering user:', error.response.data.message);
            setShowError(true)
            setErrorMessage(error?.message || "Unable to create an account.")
            throw error
        }
    };


    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);

    const googleAuthLogin = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(
        () => {
            if (user) {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        setProfile(res.data);
                        console.log("data from gooogelogin", res.data)
                    })
                    .catch((err) => console.log(err));
            }
        },
        [user]
    );

    useEffect(() => {
        const registerOrLogin = async () => {
            if (profile) {
                try {
                    const loginFormData = new FormData();
                    loginFormData.append('email', profile.email);
                    loginFormData.append('password', profile.id);

                    await loginUser(loginFormData);

                } catch (loginError) {
                    if (loginError.response && loginError.response.status === 401) {
                        try {
                            const registerFormData = new FormData();
                            registerFormData.append('firstName', profile.given_name);
                            registerFormData.append('lastName', profile.family_name);
                            registerFormData.append('email', profile.email);
                            registerFormData.append('password', profile.id);

                            await registerUser(registerFormData);

                            const loginFormData2 = new FormData();
                            loginFormData2.append('email', profile.email);
                            loginFormData2.append('password', profile.id);
                            await loginUser(loginFormData2);
                        } catch (registerError) {
                            console.error('Error while registering user:', registerError?.response?.data?.message);
                            setShowError(true)
                            setErrorMessage(registerError?.message || registerError?.error || "Error while registering user")
                        }
                    } else {
                        console.error('Error while logging in user:', loginError?.response?.data?.message);
                        setShowError(true)
                        setErrorMessage(loginError?.message || loginError?.error || "Error while logging in user")
                    }
                }
            }
        };

        registerOrLogin();
    }, [profile]);


    const logOut = () => {
        googleLogout();
        setProfile(null);
    };

    return (
        <Layout>
            {
                authenticated ?
                    navigate('/tasks')
                    :
                    <div className='flex flex-col md:w-1/3 h-full md:h-1/2 justify-center max-w-7xl'>
                        <span className='text-5xl font-bold text-blue-600 text-left pb-8'>Login</span>
                        <div className='flex flex-col items-center justify-center w-full h-fit bg-white border-2 border-blue-600 rounded-lg p-6'>
                            <InputField type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <InputField type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <Button name="Login" click={(e) => handleUserLogin(e)} />
                            <span className='text-black text-center my-4'>Don't have an account? <a className='font-semibold text-blue-600' href="/signup">Signup</a></span>
                            <button className="px-5 py-2 rounded-md w-fit text-white bg-blue-600 hover:bg-blue-800" onClick={() => googleAuthLogin()}>Login with <strong>Google</strong></button>
                            {showError ? (
                                <p className="mt-4 text-sm text-red-600 dark:text-red-400 text-center">{errorMessage}</p>
                            ) :
                                (<div>
                                </div>)}
                        </div>

                    </div>
            }
        </Layout>
    )
}
