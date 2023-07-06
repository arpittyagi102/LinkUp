import React, { useState } from "react";
import "./LoginPage.css";   
import SidebarImage from "../../Assets/SidebarImagelogin.jpg";
import googleicon from "../../Assets/google-icon.svg";
import { Link,useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import Cookies from 'js-cookie';
import SimpleCrypto from 'simple-crypto-js';

export default function LoginPage(){
 
    const [emailinput, setemailinput] = useState("");
    const [passwordinput, setpasswordinput] = useState("");
    const [output, setOutput] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate=useNavigate();
    const secretKey = process.env.REACT_APP_CRYPTO_SECRET;
    const crypto = new SimpleCrypto(secretKey);

    const handleSubmit = async (e)=>{
      setLoading(true);
       if(emailinput==="" || passwordinput===""){
          setOutput("all fields are required");
          setLoading(false);
          return;
        }
        try {
          const response = await axios.post('https://linkup-backend-k05n.onrender.com/auth/login',{email:emailinput,password:passwordinput});
          if(response.status===200){
            setLoading(false);
            console.log("Login Successfull")
            setOutput(
              <div style={{color:"green"}}>
                <div>Successfully logged in!</div>
                <div>Please wait......</div>
              </div>
            );
            const { payload } = response.data;
            const accessToken = crypto.encrypt(payload);
            Cookies.set('linkupdata',accessToken);
            setTimeout(() => {
                  navigate('/chat');
                  }, 1000);
          }
        } catch (err) {
          setLoading(false);
          console.log(err.response);
            if (err.response) {
                setLoading(false);
                setOutput(err.response.data.message);
            } else {
                setOutput("Network error occurred");
            }
        }
    }
      
    const googlelogin = useGoogleLogin({
        client_id: process.env.REACT_APP_CLIENT_ID,
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
        const accessToken = crypto.encrypt(userData);
        Cookies.set('linkupdata',accessToken);
        navigate('/chat');

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
                    <button className="login-btn"  onClick={handleSubmit}>
                      {loading===false?(
                        <div>Login</div>
                      ):(
                        <div className="spinner-border" style={{height:"20px",width:"20px"}}></div>       
                      )}
                    </button>
                    <div style={{ textAlign: "center" }} ><Link to={'/forgot'}>Forgot your Password?</Link></div>
                    <div>Don't have an account <Link to={'/signup'}>sign up</Link></div>
                    <div className="or">or</div>
                    <div className="google-login-btn" onClick={googlelogin}>
                        continue with Google
                        <img src={googleicon} className="googleicon" alt="google-icon"/>
                    </div>

                </div>
                <img src={SidebarImage} alt="Internet Error" className="sidebar"/>
            </div>
        </>
    )
}
