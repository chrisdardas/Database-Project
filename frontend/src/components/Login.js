import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/Authcontext';
import axios from 'axios';
import './styles/Login.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Attempting to log in with:', { email, username });
        
        try {
            const response = await axios.post('http://localhost:5000/player/login', { email, username});
            console.log('Login response:', response.data);
            
            if(response.data.success){
                console.log("Login successful: ", response.data.user);
                login(response.data.user);
                navigate("/main");
            }
            else{
                alert("Login failed: " + (response.data.message || "Unknown error."));
            }
        } catch (error) {
            console.error("Error logging in: ", error);
            if (error.response && error.response.data && error.response.data.message) {
                alert(`Login failed: ${error.response.data.message}`);
            } else {
                alert("An unexpected error occurred. Please try again.");
            }
        }
    };

    const handleCreateAccount = () => {
        navigate('/create-account');
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input 
                        type="email" 
                        id="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input 
                        type="text" 
                        id="username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                </div>
                {/* <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input 
                        type="password" 
                        id="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                </div> */}
                <button type="submit">Login</button>
            </form>
            <button className="create-account-button" onClick={handleCreateAccount}>
                Create Account
            </button>
        </div>
    );
};

export default Login;