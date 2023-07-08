import React, { useState,useEffect } from "react";
import "./Signup.css";
import googleicon from "../../Assets/google-icon.svg";
import SidebarImage from "../../Assets/SidebarImageSignup.jpg";
import {Link, useNavigate} from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { useGoogleOneTapLogin } from '@react-oauth/google';
import axios from 'axios';
import Cookies from 'js-cookie';
import SimpleCrypto from 'simple-crypto-js';
import CheckMarkImage from "../../Assets/check-mark.png";
import CrossImage from "../../Assets/cross.png";

export default function SignupPage() {
  
  const secretKey = process.env.REACT_APP_CRYPTO_SECRET;
  const crypto = new SimpleCrypto(secretKey);
  const navigate=useNavigate();

    try{
      const getcookies = Cookies.get('linkupdata')
      const { email } = crypto.decrypt(getcookies);
  
      if(email){
        navigate('/chat');
      } 
    } catch (err){
      console.log(err);
    }  


    
  const [formData,setFormData] = useState({
    fname:'',
    lname:'',
    email:'',
    password:'',
  })
  const [output,setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showState, setShowState] = useState(false);

  function handleChange(e){
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    setLoading(true);
    if(!formData.fname || !formData.lname || !formData.email || !formData.password){
      setShowAlert(true);
      setShowState(false);
      setOutput("all fields are required");
      setTimeout(()=>{
        setShowAlert(false);
      },3000);
      setLoading(false);
      return;
    }
    if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      setShowAlert(true);
      setShowState(false);
      setOutput("please enter a valid email");
      setTimeout(()=>{
        setShowAlert(false);
      },3000);
      setLoading(false);
      return;
    }
    if(formData.password.length < 6){
      setShowAlert(true);
      setShowState(false);
      setOutput("password must be at least 6 characters long");
      setTimeout(()=>{
        setShowAlert(false);
      },3000);
      setLoading(false);
      return;
    }
    try {
      const response = await axios.post('http://localhost:3001/auth/signup', formData);
      //const response = await axios.post('https://linkup-backend-k05n.onrender.com/auth/signup', formData);
      setLoading(false);
      console.log(response);
      setShowAlert(true);
      
      if(!navigator.onLine){
        setOutput("You are connected to internet")
      }
      if(response.status === 200){
        setShowState(true);
        setTimeout(()=>{
          setShowAlert(false);
          navigate("/login");
        },3000);
      }
      else if(response.status === 404){
        setShowState(false);
        setOutput("Unable to connect to server");
        setTimeout(()=>{
          setShowAlert(false);
        },3000);
      }

    } catch (err) {
      console.log(err);
      setShowAlert(true);
      setShowState(false);
      if (err.response) {
        setLoading(false);
        if (err.response.status === 404) {
          setOutput("Unable to connect to server");
          setTimeout(()=>{
            setShowAlert(false);
          },3000);
        } else {
          setOutput(err.response.data.message);
          setTimeout(()=>{
            setShowAlert(false);
          },3000);
        }
      } else {
        setOutput("Network error occurred");
        setTimeout(()=>{
          setShowAlert(false);
        },3000);
      }
    }}

    const googlelogin = useGoogleLogin({
      client_id: process.env.REACT_APP_CLIENT_ID,
      onSuccess: response => loginsuccess(response),
  });

    useGoogleOneTapLogin({
       onSuccess: credentialResponse => loginsuccess(credentialResponse),
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
  

  return (
    <>
      <div className="signup-page-outer">
        <img src={SidebarImage} alt="Internet Error" className="sidebar" />
        <div className="signup-form-outer">
          <div className="signup-page-title">
            Get <span style={{ color: "blue" }}>Link Up</span>
          </div>

          <div className="form-input-names">
            <div>
              <div className="label">First Name</div>
              <input type="text" placeholder="Arpit" value={formData.fname} name="fname" onChange={handleChange} />
            </div>
            <div>
              <div className="label">Last Name</div>
              <input type="text" placeholder="Tyagi" value={formData.lname} name="lname" onChange={handleChange} />
            </div>
          </div>

          <div className="label">Email Address</div>
          <input type="email" placeholder="youremail@example.com" value={formData.email} name="email" onChange={handleChange} />

          <div className="label">Password</div>
          <input type="password" placeholder="••••••••••" value={formData.password} name="password" onChange={handleChange} />
          <input type={"hidden"}></input>
          {
            showState == true?(
                showAlert && (
                    <div className="success-alert">
                      <img src={CheckMarkImage} className="alert-img"></img>Successful sign up!
                    </div>)
            ):(
                showAlert && (
                    <div className="error-alert">
                      <img src={CrossImage} className="alert-img"></img>{output}
                    </div>)
            )
          }
          <button className="signup-btn"  onClick={handleSubmit}>
            {loading===false?(
              <div>Sign Up</div>
            ):(
              <div className="spinner-border" style={{height:"20px",width:"20px"}}></div>       
            )}
          </button>
          <div>
            Already have an account <Link to={'/login'}>log in</Link>
          </div>
          <div className="or">or</div>
          <div className="google-signup-btn" onClick={googlelogin}>
            continue with Google
            <img src={googleicon} className="googleicon" alt="google-icon" />
          </div>
        </div>
      </div>
    </>
  );
}
