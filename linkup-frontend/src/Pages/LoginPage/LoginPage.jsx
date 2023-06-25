import React, { useEffect, useState } from "react";
import "./LoginPage.css";   
import SidebarImage from "../../Assets/SidebarImagelogin.jpg";
import googleicon from "../../Assets/google-icon.svg";
import { Link,useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { useGoogleLogin } from '@react-oauth/google';

export default function LoginPage(){

    const [emailinput, setemailinput] = useState("");
    const [passwordinput, setpasswordinput] = useState("");
    const [socket, setSocket] = useState("");
    const navigate=useNavigate();
       
    useEffect(() => {
        //const socket = io.connect("http://localhost:3001");
        const socket = io.connect("https://linkup-backend-k05n.onrender.com/");
        setSocket(socket);
        
        socket.on("login-attempt-response", (response) => {
            console.log("A response came ",response)
            if(response === "SUCCESSFULL"){
                navigate('/chat')
            }
            else if(response === "WRONGPASSWORD")
                alert("Wrong Password")
            else if(response === "WRONGEMAIL")
                alert("Couldn't find an account with this email")
            else if(response === "UNSUCCESSFULL")
                alert("Couldn't login")
        });
    
        return () => {
          socket.disconnect();
        };
      }, []);

      function handlesubmit(){
          socket.emit("login-attempt",{email:emailinput,password:passwordinput})
      }
    
    

    const login = useGoogleLogin({
        client_id: '727992305515-cvm709miv8d2fnmtqcf9ovv0vgqktsdc.apps.googleusercontent.com',
        onSuccess: response => loginsuccess(response),
    });
    
    function loginsuccess(response) {
        const { access_token } = response;
      
        // Make a request to the Google API to get user data
        fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
          .then(response => response.json())
          .then(userData => {
            console.log("User Data:", userData);
            // Access specific properties of the userData object
            console.log("Name:", userData.name);
            console.log("Email:", userData.email); 
            console.log("Picture:", userData.picture);
          })
          .catch(error => {
            console.error("Error fetching user data:", error);
          });
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
