import React from "react";
import "./LoginPage.css";   
import SidebarImage from "../../Assets/SidebarImagelogin.jpg";
import googleicon from "../../Assets/google-icon.svg";
import { Link,useNavigate } from "react-router-dom";
//import io from "socket.io-client";

//const socket = io.connect("https://link-up-backend.vercel.app/");

export default function LoginPage(){

    /* socket.on("CTS",()=>{
        console.log("connected to Server")
    }) */
    const navigate=useNavigate();

    function handlesubmit(){
        navigate('/chat');
    }
    return(
        <>
            <div className="login-page-outer">
                <div className="login-form-outer">
                    <div className="login-page-title">Welcome back</div>

                    <div className="label">Email Address</div>
                    <input type="email" placeholder="youremail@example.com"/>

                    <div className="label">Password</div>
                    <input type="password" placeholder="••••••••••"/>

                    <div><input type="checkbox"/> Remember me</div>

                    <input type="submit" className="login-btn" value="Login" onClick={handlesubmit}/>
                    <div>Don't have an account <Link to={'/signup'}>sign up</Link></div>
                    <div className="or">or</div>
                    <div className="google-login-btn">
                        Login with Google
                        <img src={googleicon} className="googleicon" alt="google-icon"/>
                    </div>

                </div>
                <img src={SidebarImage} alt="Internet Error" className="sidebar"/>
            </div>
        </>
    )
}