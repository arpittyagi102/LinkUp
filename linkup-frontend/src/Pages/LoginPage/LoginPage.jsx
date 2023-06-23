import React, { useEffect, useState } from "react";
import "./LoginPage.css";   
import SidebarImage from "../../Assets/SidebarImagelogin.jpg";
import googleicon from "../../Assets/google-icon.svg";
import { Link,useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { useGoogleLogin } from '@react-oauth/google';
import jwtDecode from 'jwt-decode';

const socket = io.connect("https://linkup-backend-k05n.onrender.com/");

export default function LoginPage(){
    
    const navigate=useNavigate();
    useEffect(()=>{
        socket.on("CTS",()=>{
            console.log("We are now connected to server")
        }) 
    },[])

    const login = useGoogleLogin({
        client_id: '727992305515-cvm709miv8d2fnmtqcf9ovv0vgqktsdc.apps.googleusercontent.com',
        onSuccess: codeResponse => loginsuccess(codeResponse),
    });

    function loginsuccess(response){
        userdata=jwtDecode(response.credential);
        console.log("Name : "+userdata.name)    
        console.log("email : "+userdata.email)    
        console.log("Picture : "+userdata.picture);
    }

    const [emailinput, setemailinput] = useState("");
    const [passwordinput, setpasswordinput] = useState("");

    function handlesubmit(){
        //navigate('/chat');
        console.log(`Email Address = ${emailinput}`)
        console.log(`Password = ${passwordinput}`)
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

                    <div><input type="checkbox"/> Remember me</div>

                    <input type="submit" className="login-btn" value="Login" onClick={handlesubmit}/>
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
