import React from "react";
import "./LoginPage.css";   
import SidebarImage from "./SidebarImage.jpg";

export default function LoginPage(){
    return(
        <>
            <div className="login-page-outer">
                <div className="form-outer">
                    <div className="login-page-title">Welcome</div>
                    <div>Email Address</div>
                    <input type="text" placeholder="email@example.com"/>
                    <div>Password</div>
                    <input type="password" placeholder="*****************"/>
                    <div><input type="checkbox"/> Remember me</div>
                    <button>Login</button>
                    <div>dont have an account sign in</div>
                    or
                    <div>Login with Google</div>

                </div>
                <img src={SidebarImage} alt="Internet Error" className="sidebar"/>
            </div>
        </>
    )
}