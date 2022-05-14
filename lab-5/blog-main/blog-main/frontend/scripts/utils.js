export const BACKEND_URL = 'http://localhost:3001/api';

export const authHeader = () => {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'));
    if (accessToken) {
        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: 'Bearer: ' + accessToken
        };
    } else {
        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        };
    }
};

export const setAccessToken = (accessToken) => {
    localStorage.setItem('accessToken', JSON.stringify(accessToken));
};


export const setUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
};


export const isEditor = () => {
    const user = JSON.parse(localStorage.getItem('user') ?? '{}');
    return !!(user && user.role === 'editor');
};


export const clearAccessToken = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
};

export const isAuthorized = () => {
    return !!localStorage.getItem('accessToken');
};
