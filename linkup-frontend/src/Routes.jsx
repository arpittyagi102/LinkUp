import React, { lazy } from 'react';
const LoginPage = lazy(() => import('./Pages/LoginPage/LoginPage'));
const SignupPage = lazy(() => import('./Pages/SignupPage/SignupPage'));
const ForgotPass = lazy(() => import('./Pages/ForgotPass/ForgotPass'));
const Chat = lazy(() => import('./Pages/Chat/Chat'));
const Users = lazy(() => import('./Pages/Users/Users'));

const routes = [
    {
        path: '/',
        exact: true,
        element: <SignupPage />
    },
    {
        path: '/chat',
        exact: true,
        element: <Chat />
    },
    {
        path: '/login',
        exact: true,
        element: <LoginPage />
    },
    {
        path: '/signup',
        exact: true,
        element: <SignupPage />
    },
    {
        path: '/forgot',
        exact: true,
        element: <ForgotPass />
    },
    {
        path: '/users',
        exact: true,
        element: <Users />
    }
]

export default routes;