import React, { useState } from "react";
import "./Signup.css";
import googleicon from "../../Assets/google-icon.svg";
import SidebarImage from "../../Assets/SidebarImageSignup.jpg";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import axios from 'axios';
import Cookies from 'js-cookie';
import SimpleCrypto from 'simple-crypto-js';

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

  function handleChange(e){
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    setLoading(true);
    if(!formData.fname || !formData.lname || !formData.email || !formData.password){
      setOutput("all fields are required");
      setLoading(false);
      return;
    }
    if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      setOutput("please enter a valid email");
      setLoading(false);
      return;
    }
    if(formData.password.length < 6){
      setOutput("password must be at least 6 characters long");
      setLoading(false);
      return;
    }
    try {
      //const response = await axios.post('http://localhost:3001/auth/signup', formData);
      const response = await axios.post('https://linkup-backend-k05n.onrender.com/auth/signup', formData);
      setLoading(false);
      console.log(response);

      if(!navigator.onLine){
        setOutput("You are connected to internet")
      }
      if(response.status === 200){
        navigate("/login");
      }
      else if(response.status === 404){
        setOutput("Unable to connect to server");
      }

    } catch (err) {
      console.log(err);
      if (err.response) {
        setLoading(false);
        if (err.response.status === 404) {
          setOutput("Unable to connect to server");
        } else {
          setOutput(err.response.data.message);
        }
      } else {
        setOutput("Network error occurred");
      }
    }}

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
          <div style={{color:"red"}}>
            {output}
          </div>

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
