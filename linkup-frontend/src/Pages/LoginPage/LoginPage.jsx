import React, { useState } from "react";
import "./LoginPage.css";   
import SidebarImage from "../../Assets/SidebarImagelogin.jpg";
import googleicon from "../../Assets/google-icon.svg";
import { Link,useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function LoginPage(){

    const [emailinput, setemailinput] = useState("");
    const [passwordinput, setpasswordinput] = useState("");
    const [output, setOutput] = useState("");
    const navigate=useNavigate();

    const handleSubmit = async (e)=>{
       if(emailinput==="" || passwordinput===""){
          setOutput("all fields are required");
          return;
        }
        try {
          const response = await axios.post('https://linkup-backend-k05n.onrender.com/auth/login',{email:emailinput,password:passwordinput} );
          console.log(response.data);     
        } catch (err) {
          console.log(err.response);
        }
    }
      
    const login = useGoogleLogin({
        client_id: process.env.client_id || "727992305515-cvm709miv8d2fnmtqcf9ovv0vgqktsdc.apps.googleusercontent.com",
        onSuccess: response => loginsuccess(response),
    });
    
    async function loginsuccess(response) {
      try {
        const { access_token } = response;
        const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        const userData = userInfoResponse.data;
        console.warn(userData);
        
        const loginResponse = await axios.post('https://linkup-backend-k05n.onrender.com/auth/googleLogin', userData);
        console.log(loginResponse);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }  

    return(
        <>
            <div className="login-page-outer">
                <div className="login-form-outer">
                    <div className="login-page-title">Welcome back</div>

                    <div className="label">Email Address</div>
                    <input type="email" placeholder="youremail@example.com" 
                            value={emailinput} onChange={(e)=>{setemailinput(e.target.value)}}/>

                    <div className="label">Password</div>
                    <input type="password" placeholder="••••••••••"
                            value={passwordinput} onChange={(e)=>{setpasswordinput(e.target.value)}}   />

                    <div style={{color:"red"}}>{output}</div>
                    <input type="submit" className="login-btn" value="Login" onClick={handleSubmit}/>
                    <div style={{ textAlign: "center" }} ><Link to={'/forgot'}>Forgot your Password?</Link></div>
                    <div>Don't have an account <Link to={'/signup'}>sign up</Link></div>
                    <div className="or">or</div>
                    <div className="google-login-btn" onClick={()=>{login()}}>
                        Login with Google
                        <img src={googleicon} className="googleicon" alt="google-icon"/>
                    </div>

                </div>
                <img src={SidebarImage} alt="Internet Error" className="sidebar"/>
            </div>
        </>
    )
}
