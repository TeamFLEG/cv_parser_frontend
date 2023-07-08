import { createContext, useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";

import {BASE_URL} from "../utils/constants";

const AuthContext = createContext({});

export default AuthContext;

export const AuthProvider = ({ children }) => {

    let [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
    let [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwt_decode(localStorage.getItem('authTokens')) : null);
    let [networkName, setNetworkName] = useState(null);
    let [loading, setLoading] = useState(true);

    let redirectTo = useNavigate();

    let loginUser = async (e: { preventDefault: () => void; target: { username: { value: any; }; password: { value: any; }; }; }) => {
        e.preventDefault();

        let response = await fetch(`${BASE_URL}auth/token/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'email': e.target.username.value,
                'password': e.target.password.value
            })
        })

        let data = await response.json()

        if(response.status === 200) {
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
            redirectTo('/network-config')

        } else {
            // alertbox({text: "Error occurred while logging in", type: "error"});
            console.log(data.detail);
        }

        // //For debugging
        // console.log('data: ', data)
    }

    let logoutUser = () => {
        // alertbox({text: "You have been successfully logged out", type: "success"})
        setAuthTokens(null);
        setUser(null);
        sessionStorage.clear()
        redirectTo('/login')
    }


    let updateToken = async() => {
        console.log("Updating Token");
        let response = await fetch(`${BASE_URL}auth/token/refresh/`, {
            method: 'POST',
            headers: {
                'no-cors': 'true', //For testing
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'refresh': authTokens?.refresh
            })
        })

        let data = await response.json()

        if(response.status === 200) {
            setAuthTokens(data)
            setUser(jwt_decode(data.access))
            localStorage.setItem('authTokens', JSON.stringify(data))
            // console.log("Token updated");
        } else {
            // alertbox({text: "Invalid token, try logging in again", type: "error"});
            console.log(data.detail);
        }

        setLoading(false);
    }

    let contextData = {
        user: user,
        networkName: networkName,
        loginUser: loginUser,
        logoutUser: logoutUser,
        setNetworkName: setNetworkName
    }

    useEffect(() => {
        if(loading) {
            updateToken();
        }

        //Update token every 4 minutes
        let timeInterval = 1000 * 60 * 4;
        let interval = setInterval(() =>{
            if(authTokens) {
                updateToken();
            }

        }, timeInterval)

        return () => clearInterval(interval)

    }, [authTokens, loading])



    return(
        <AuthContext.Provider value={contextData}>
            {children}
        </AuthContext.Provider>
    )
}