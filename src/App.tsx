// Importing 3rd party libraries
import React, {Suspense} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {AuthProvider} from "./context/authcontext";

// Importing authentification context

// Importing components

// Importing pages
const Home = React.lazy(() => import('./pages/home'));
const Login = React.lazy(() => import('./pages/login'));
const Register = React.lazy(() => import('./pages/register'));
const ForgotPassword = React.lazy(() => import('./pages/forgotPassword'));
const ResetPassword = React.lazy(() => import('./pages/resetPassword'));


function App() {
    return (
        <Router>
            <AuthProvider>
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        { /* Path accessible only after login */}
                        <Route path="/" element={<Home/>}/>
                        { /* Path accessible only before login */}
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/forgot-password" element={<ForgotPassword/>}/>
                        <Route path="/reset-password/:uidb64/:token" element={<ResetPassword/>}/>
                    </Routes>
                </Suspense>
            </AuthProvider>
        </Router>
    );
}

export default App;
