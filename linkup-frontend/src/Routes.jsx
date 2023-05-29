import LoginPage from './Pages/LoginPage/LoginPage'
import SignupPage from './Pages/SignupPage/SignupPage';
import Chat from './Pages/Chat/Chat';

const routes=[
    {
        path:'/',
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
    }
]

export default routes;