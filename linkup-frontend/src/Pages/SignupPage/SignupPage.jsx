import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./Signup.css";
import googleicon from "../../Assets/google-icon.svg";
import SidebarImage from "../../Assets/SidebarImageSignup.jpg";

export default function SignupPage() {
  const [fname, setfname] = useState("");
  const [lname, setlname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    //const socket = io.connect("http://localhost:3001");
    const socket = io.connect("https://linkup-backend-k05n.onrender.com/");
    setSocket(socket);

    socket.on("signup-attempt-response", (response) => {
      console.log("Signup attempt response came ", response);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handlesubmit = function () {
    if (!socket) console.error("Not connected to server");
    const userdata = { fname: fname, lname: lname, email: email, password: password };
    console.log("Register Button clicked");
    socket.emit("signup-attempt", userdata);
  };

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
              <input type="text" placeholder="Arpit" value={fname} onChange={(e) => setfname(e.target.value)} />
            </div>
            <div>
              <div className="label">Last Name</div>
              <input type="text" placeholder="Tyagi" value={lname} onChange={(e) => setlname(e.target.value)} />
            </div>
          </div>

          <div className="label">Email Address</div>
          <input type="email" placeholder="youremail@example.com" value={email} onChange={(e) => setemail(e.target.value)} />

          <div className="label">Password</div>
          <input type="password" placeholder="••••••••••" value={password} onChange={(e) => setpassword(e.target.value)} />

          <div>
            <input type="checkbox" /> Remember me
          </div>

          <input type="submit" className="signup-btn" onClick={handlesubmit} value="Register" />
          <div className="or">or</div>
          <div className="google-signup-btn">
            Sign up with Google
            <img src={googleicon} className="googleicon" alt="google-icon" />
          </div>
        </div>
      </div>
    </>
  );
}
