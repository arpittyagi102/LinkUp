import React, { useState, useEffect } from "react";
import { BasicSchema } from "../../../src/Schemas";
import io from "socket.io-client";
import "./Signup.css";
import googleicon from "../../Assets/google-icon.svg";
import SidebarImage from "../../Assets/SidebarImageSignup.jpg";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";

export default function SignupPage() {

  const [fname, setfname] = useState("");
  const [lname, setlname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [socket, setSocket] = useState(null);
  const navigate=useNavigate();

  useEffect(() => {
    //const socket = io.connect("http://localhost:3001");
    const socket = io.connect("https://linkup-backend-k05n.onrender.com/");
    setSocket(socket);

    socket.on("signup-attempt-response", (response) => {
        console.log("Signup attempt response came ", response);
        if(response === "SUCCESSFULL"){
            navigate('/login')
        }
        else if(response === "USERALREADYEXISTS")
            alert("A user with this email address is already exists")
        else if(response === "UNSUCCESSFULL")
            alert("An error Occured")
    
    });

    return () => {
      socket.disconnect();
    };
  }, []); 

const onSubmit = async (values, actions) => {
  console.log(values);
  setfname(values.firstname)
  setlname(values.lastname)
  setemail(values.email)
  setpassword(values.password)  

  await new Promise(resolve => setTimeout(resolve, 1000))

  actions.resetForm()
  if (!socket) console.error("Not connected to server");
    const userdata = { fname: fname, lname: lname, email: email, password: password };
    console.log("Register Button clicked");
    socket.emit("signup-attempt", userdata);
  
}
  const { values, handleBlur, handleChange, isSubmitting,errors, handleSubmit, touched } = useFormik({
    initialValues: {
      firstname: '',
      lastname: '',
      email: '',
      password: '',
    },
    validationSchema: BasicSchema,
    onSubmit,
  })
  return (
    <>
      <div className="signup-page-outer">
        <img src={SidebarImage} alt="Internet Error" className="sidebar" />
        <div className="signup-form-outer">
          <div className="signup-page-title">
            Get <span style={{ color: "blue" }}>Link Up</span>
          </div>
              <form onSubmit={handleSubmit} autoComplete="off"> 
                  <div className="form-input-names">
                    <div>
                      <div className="label">First Name</div>
                      <input type="text" placeholder="Arpit" value={values.firstname} onChange={handleChange} 
                      onBlur={handleBlur} 
                        id="firstname"
                        className={errors.firstname && touched.firstname ? 'input-error' : ''}
                      />
                       {errors.firstname && touched.firstname && <p className='error'>{errors.firstname}</p>}
                    </div>
                    <div>
                      <div className="label">Last Name</div>
                      <input type="text" placeholder="Tyagi" value={values.lastname} 
                      onBlur={handleBlur}
                      onChange={handleChange} 
                      id="lastname" className={errors.lastname && touched.lastname ? 'input-error' : ''}/>
                      {errors.lastname && touched.lastname && <p className='error'>{errors.lastname}</p>}
                    </div>
                  </div>   
                  <div className="label">Email Address</div>
                  
                  <input 
                  type="email"
                  id="email" 
                  onBlur={handleBlur} 
                  placeholder="youremail@example.com" 
                  value={values.email} onChange={handleChange} className={errors.email && touched.email ? 'input-error' : ''} />
                  {errors.email && touched.email && <p className='error'>{errors.email}</p>}
                  <div className="label">Password</div>
                  <input type="password" placeholder="••••••••••" 
                  onBlur={handleBlur} id="password" value={values.password} onChange={handleChange} className={errors.password && touched.password ? 'input-error' : ''}/>
                  {errors.password && touched.password && <p className='error'>{errors.password}</p>}
                  <div>
                    <input type="checkbox" /> Remember me
                  </div>
                  <input type="submit" className="signup-btn" value="Register" disabled={isSubmitting}/>
              </form>
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
