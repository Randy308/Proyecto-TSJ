import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthUser = () => {
    const navigate = useNavigate();

    const getToken = () => {
        const tokenString = sessionStorage.getItem('token');
        const token = JSON.parse(tokenString);
        return token;
    };

    const getUser = () => {
        const userString = sessionStorage.getItem('user');
        const user = JSON.parse(userString);
        return user;
    };

    const getRol = () => {
        const rolString = sessionStorage.getItem('rol');
        const rol = JSON.parse(rolString);
        return rol;
    };

    const [token, setToken] = useState(getToken);
    const [user, setUser] = useState(getUser); // Corrected to use getUser
    const [rol, setRol] = useState(getRol); // Corrected to use getRol

    const saveToken = (user, token, rol) => {
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('token', JSON.stringify(token));
        sessionStorage.setItem('rol', JSON.stringify(rol));
        setUser(user);
        setRol(rol);
        setToken(token);

        if (getRol() === "admin") {
            navigate('/admin');
        } else if (getRol() === "user") {
            navigate('/user');
        }
    };

    const getLogout = () => {
        sessionStorage.clear();
        navigate('/');
    };

    return {
        saveToken,
        token,
        user,
        rol,
        getToken,
        getLogout
    };
};

export default AuthUser;
