import React from 'react';
import './App.css';
import Login from './components/Login'; // Import the Login component
import CreateAccount from './components/CreateAccount'; // Import the CreateAccount component
import PlayerList from './components/PlayerList'; // Import the PlayerList component
import GameList from './components/GameList'; // Import the GameList component
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import React Router components
import ReviewsList from './components/ReviewsList'; // Import the ReviewsList component
import { AuthProvider } from './context/Authcontext'; // Import the AuthProvider component
import ProtectedRoute from './components/Protected'; // Import the ProtectedRoute component
import MainPage from './components/MainPage'; // Import the MainPage component
// import ReactDOM from 'react-dom/client';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route 
                        path="/players" 
                        element={
                            <ProtectedRoute>
                                <PlayerList />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/games" 
                        element={
                            <ProtectedRoute>
                                <GameList />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/reviews" 
                        element={
                            <ProtectedRoute>
                                <ReviewsList />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/create-account" 
                        element={<CreateAccount />} 
                    />
                    <Route 
                        path="/main" 
                        element={
                            <ProtectedRoute>
                                <MainPage />
                            </ProtectedRoute>
                        } 
                    />
                    <Route path="*" element={<h1>404: Not Found</h1>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
