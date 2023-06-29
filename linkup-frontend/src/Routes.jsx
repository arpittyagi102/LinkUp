import LoginPage from './Pages/LoginPage/LoginPage'
import SignupPage from './Pages/SignupPage/SignupPage';
import ForgotPass from './Pages/ForgotPass/ForgotPass';
import Chat from './Pages/Chat/Chat';
import Users from './Pages/Users/Users';

const routes=[
    {
        path:'/',
        exact:true,
        element:<Chat/>
    },
    {
        path:'/chat',
        exact:true,
        element:<Chat/>
    },
    {
        path:'/login',
        exact:true,
        element:<LoginPage/>
    },
    {
        path:'/signup',
        exact:true,
        element:<SignupPage/>
    },
    {
        path:'/forgot',
        exact:true,
        element:<ForgotPass/>
    },
    {
        path:'/users',
        exact:true,
        element:<Users/>
    }
]

export default routes;