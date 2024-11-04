import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/layout';
import InputField from '../components/inputField';
import Button from '../components/Button';
import { useAuthentication } from '../Authentication';
import { SERVER_URL } from "../config";
import axios from "axios";

export default function Login() {
    const authenticated = localStorage.getItem('authenticated');
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { isAuthenticated } = useAuthentication();
    const location = useLocation();

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
            formData.append('username', email);
            formData.append('password', password);

            await loginUser(formData);
        } catch (error) {
            setErrorMessage("Invalid username or password")
            setShowError(true)
        }
    };

    const loginUser = async (formData) => {
        try {
            const response = await axios.post(`${SERVER_URL}/api/token/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log("status:", response)
            const { access, refresh } = response.data;
            console.log('Access token received:', access);
            localStorage.clear();
            sessionStorage.clear();
            localStorage.setItem('accessToken', access);
            localStorage.setItem('refreshToken', refresh);
            isAuthenticated().then(r => {
            });
            // fetchUserData(access).then(r => {
            // })

            if (location.state !== null) {
                navigate(location.state.path)
            } else {
                navigate("/tasks");
            }
        } catch (error) {
            setErrorMessage("Invalid username or password")
            setShowError(true)
            throw error;
        }
    };


    return (
        <Layout>
            {
                authenticated ?
                    navigate('/tasks')
                    :
                    <div className='flex flex-col md:w-1/3 h-full md:h-1/2 justify-center'>
                        <span className='text-5xl font-bold text-blue-600 text-left pb-8'>Login</span>
                        <div className='flex flex-col items-center justify-center w-full h-fit bg-white border-2 border-blue-600 rounded-lg p-6'>
                            <InputField type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <InputField type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <Button name="Login" click={(e) => handleUserLogin(e)} />
                            <span className='text-black text-center my-4'>Don't have an account? <a className='font-semibold text-blue-600' href="/signup">Signup</a></span>
                            <button className="px-5 py-2 rounded-md w-fit text-white bg-blue-600 hover:text-blue-600 hover:bg-white" onClick={() => console.log('hello Google')}>Login with <strong>Google</strong></button>
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
