import React, { useState } from "react";
import "./ForgotPass.css";
import banner from '../../Assets/frgt.png';
import { Link } from "react-router-dom";

export default function ForgotPass() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleForgotPassword = () => {
        // Perform the password reset functionality here
        // You can make an API call to send a password reset email
        // You can use libraries like axios or fetch to make the API call

        // Placeholder code to simulate sending a password reset email
        if (email) {
            // Simulating an asynchronous call
            setTimeout(() => {
                alert(`A password reset email has been sent to ${email}`);
            }, 2000);
        } else {
            setMessage("Please enter your email address");
        }
    };

    return (
        <>
            <div className="login-page-outer" style={{ backgroundColor: 'rgb(255, 222, 162)' }}>
                <img style={{ mixBlendMode: "multiply" }} src={banner} alt="Internet Error" className="sidebar" />
                <div className="login-form-outer">
                    <div className="login-page-title">Password Reset</div>
                    <p>
                        Enter your LinkUp username, or the email address that you used to register. We'll send you an email with your
                        username and a link to reset your password.
                    </p>
                    <div className="label">Email Address</div>
                    <input type="email" placeholder="youremail@example.com" value={email} onChange={handleEmailChange} />
                    <input type="submit" className="login-btn" value="Forgot" onClick={handleForgotPassword} />
                    {message && <div className="message">{message}</div>}
                    <div>Don't have an account <Link to="/signup">sign up</Link></div>
                    <div className="or">or</div>
                    <div style={{ textAlign: "center" }} ><Link to="/login">Back to Login</Link></div>
                </div>
            </div>
        </>
    );
}
