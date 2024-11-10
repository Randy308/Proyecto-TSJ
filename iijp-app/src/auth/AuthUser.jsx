import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthUser = () => {
    const navigate = useNavigate();

    const getToken = () => {
        const tokenString = sessionStorage.getItem('token');
        return tokenString ? JSON.parse(tokenString) : null;
    };

    const getUser = () => {
        const userString = sessionStorage.getItem('user');
        return userString ? JSON.parse(userString) : null;
    };

    const getRol = () => {
        const rolString = sessionStorage.getItem('rol');
        return rolString ? JSON.parse(rolString) : null;
    };

    const [token, setToken] = useState(getToken);
    const [user, setUser] = useState(getUser);
    const [rol, setRol] = useState(getRol);

    const saveToken = (user, token, rol) => {
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('token', JSON.stringify(token));
        sessionStorage.setItem('rol', JSON.stringify(rol));
        setUser(user);
        setToken(token);
        setRol(rol);

        if (rol === "admin") {
            navigate('/admin');
        } else if (rol === "user" || rol === "editor") {
            navigate('/user');
        }else{
            navigate('/')
        }
    };

    const can = (permission) => (user?.permissions || []).includes(permission);

    const getLogout = () => {
        sessionStorage.clear();
        setUser(null);
        setToken(null);
        setRol(null);
        navigate('/');
    };

    return {
        saveToken,
        token,
        user,
        can,
        rol,
        getToken,
        getLogout,
    };
};

export default AuthUser;
