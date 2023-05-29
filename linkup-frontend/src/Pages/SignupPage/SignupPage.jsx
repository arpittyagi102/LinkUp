import React from "react";
import "./Signup.css";   
import googleicon from "../../Assets/google-icon.svg";
import SidebarImage from "../../Assets/SidebarImageSignup.jpg";

export default function SignupPage(){
    return(
        <>
            <div className="signup-page-outer">
                <img src={SidebarImage} alt="Internet Error" className="sidebar"/>
                <div className="signup-form-outer">
                    <div className="signup-page-title">Get <span style={{color:"blue"}}>Link Up</span></div>

                    <div className="form-input-names">
                        <div>
                            <div className="label">First Name</div>
                            <input type="text" placeholder="Arpit"/>
                        </div>
                        <div>
                            <div className="label">Last Name</div>
                            <input type="text" placeholder="Tyagi"/>
                        </div>
                    </div>
                    
                    <div className="label">Email Address</div>
                    <input type="email" placeholder="youremail@example.com"/>

                    <div className="label">Password</div>
                    <input type="password" placeholder="••••••••••"/>

                    <div><input type="checkbox"/> Remember me</div>

                    <input type="submit" className="signup-btn" value="Register"/>
                    <div className="or">or</div>
                    <div className="google-signup-btn">
                        Sign up with Google
                        <img src={googleicon} className="googleicon" alt="google-icon"/>
                    </div>

                </div>
                
            </div>
        </>
    )
}