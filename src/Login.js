import React, { useState } from "react";
import { BiMessage } from "react-icons/bi";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./FirebaseConfig";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  function AutheticateUser() {  
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("User signed in");
        navigate("/Layout");
        localStorage.setItem("user", JSON.stringify(userCredential.user.email));
        localStorage.setItem("handlingResponsive", "nav");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error signing in:", errorCode, errorMessage);
      });
  }

  return (
    <div className="flex items-center justify-center m-5 sm:m-0 w-auto sm:w-full h-screen">
      <div className="border border-gray-300 rounded-xl p-10 shadow-xl">
        <div className="mb-10">
          <div className="flex items-center space-x-2">
            <BiMessage className="text-[#333333]" size={40} />
            <p className="text-[#333333] font-bold text-3xl">Your Chat!</p>
          </div>
          <p className="text-blue-500">Talk Freely. Connect Instantly.</p>
        </div>
        <div className="text-[#333333] font-semibold">
          <p>Email:</p>
          <input
            onChange={(e) => setemail(e.target.value)}
            className="p-1 border border-gray-300 rounded w-60 sm:w-80"
            type="email"
          ></input>
        </div>
        <div className="mt-3">
          <p>Password:</p>
          <input
            onChange={(e) => {
              setpassword(e.target.value);
            }}
            className="p-1 border border-gray-300 rounded w-60 sm:w-80"
            type="password"
          ></input>
        </div>
        <div className="flex justify-center mt-10">
          <button
            onClick={() => {
              AutheticateUser();
            }}
            className="bg-[#333333] text-white py-1 w-full rounded"
          >
            Sign In
          </button>
        </div>
        <div className="flex items-center justify-center space-x-2 mt-1.5">
          <p>Don't have an account?</p>
          <button 
          onClick={()=>{
            navigate("/SignUp");
          }}
          className="text-blue-500 font-semibold underline">SignUp</button>
        </div>
      </div>
    </div>
  );
}

export default Login;
