import React from "react";
import "./LoginPage.css";   
import SidebarImage from "./SidebarImage.jpg";
import googleicon from "../../Assets/google-icon.svg";

export default function LoginPage(){
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

                    <input type="submit" className="login-btn" value="Login"/>
                    <div>Don't have an account, sign in</div>
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