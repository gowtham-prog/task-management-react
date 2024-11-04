import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/layout';
import InputField from '../components/inputField';
import Button from '../components/Button';
import { useAuthentication } from '../Authentication';
import { SERVER_URL } from "../config";
import axios from "axios";


export default function Signup() {
    const authenticated = localStorage.getItem('authenticated');
    const navigate = useNavigate();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { isAuthenticated } = useAuthentication();
    const location = useLocation();

    const handleUserSingup = (e) => {
        e.preventDefault();
        submitForm();
    };

    const submitForm = async () => {
        setShowError(false)
        setErrorMessage("")
    
        if(email === "" || firstName === "" || lastName === "" || email === "" || password === "" || confirmPassword === "") {
            setShowError(true)
            setErrorMessage("Please enter all credentials")
            return
        }

        if (password !== confirmPassword) {
            setShowError(true)
            setErrorMessage("Passwords do not match")
            return
        }
    
        try {
            const formData = new FormData();
            formData.append('username', email);
            formData.append('first_name', firstName);
            formData.append('last_name', lastName);
            formData.append('email', email);
            formData.append('password', password);
            console.log("registering user", formData)
    
            await registerUser(formData);

            const loginFormData1 = new FormData();
            loginFormData1.append('username', email);
            loginFormData1.append('password', password);
            console.log("login user", loginFormData1)

            await loginUser(loginFormData1);
            
        } catch (error) {
            console.error('Error while registering user:', error.response.data.message);
            setShowError(true)
            setErrorMessage(error.response.data.message)
        }
    };

    const registerUser = async (formData) => {
        try {
            const response = await axios.post(`${SERVER_URL}/api/v1/user/create/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            if (response.status === 201) {
                // navigate("/signin");
                console.log('User registered successfully:', response.data);
            } else {
                setShowError(true)
                setErrorMessage("Unable to create an account.")
            }
        } catch (error) {
            console.error('Error while registering user:', error.response.data.message);
            setShowError(true)
            setErrorMessage(error.response.data.message)
            throw error
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
                    navigate('/dashboard')
                    :
                    <div className='flex flex-col md:w-1/3 h-full md:h-1/2 justify-center'>
                        <span className='text-5xl font-bold text-blue-600 text-left pb-8'>Sign in</span>
                        <div className='flex flex-col items-center justify-center w-full h-fit bg-white border-2 border-blue-600 rounded-lg p-6'>
                            <InputField type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                            <InputField type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                            <InputField type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <InputField type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            <InputField type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                            <Button name="Sign up" click={(e) => handleUserSingup(e)} />
                            <span className='text-black text-center my-4'>Already have an account? <a className='font-semibold text-blue-600' href="/login">Login</a></span>
                            <button className="px-5 py-2 rounded-md w-fit text-white bg-blue-600 hover:text-blue-600 hover:bg-white" onClick={() => console.log('hello Google')}>Signup with <strong>Google</strong></button>
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