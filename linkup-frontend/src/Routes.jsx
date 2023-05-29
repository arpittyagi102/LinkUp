import LoginPage from './Pages/LoginPage/LoginPage'
import SignupPage from './Pages/SignupPage/SignupPage';

const routes=[
    /* {
        path:'/',
        exact:true,
        component:<h1>Welcome to LinkUp</h1>
    }, */
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