"use client"
import React, { useState } from "react"
import '../../styles/register.css'
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastContainer,toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [passwordError,setPasswordError]=useState("")
    const router=useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
        if (name === "confirmPassword" || name === "password") {
            if (name === "confirmPassword" && value !== formData.password) {
              setPasswordError("Passwords didn't match");
            } else if (name === "password" && formData.confirmPassword && value !== formData.confirmPassword) {
              setPasswordError("Passwords didn't match");
            } else {
              setPasswordError("");
            }
          }

    }

    const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setPasswordError("Passwords didn't match");
            return;
          }
        // console.log("Form submitted", formData)
        try{
            const response=await fetch("http://localhost:5000/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            })
            const data = await response.json()
            if(response.ok && data.success){
                // setMessage(data.message)
                toast.success("Registration successful" ,{autoClose:5000,onClick:()=>router.push('/signin')})
                setFormData({username:"",email:"",password:"",confirmPassword:""})
                // setTimeout(()=>{
                //     router.push('/signin')
                // },5000)
            }else if(data.message==='User already exists'){
                toast.warn('User already registered', {autoClose: 5000})

            } else{
                toast.error('Registration failed', {autoClose: 5000})
            }

        }catch(error){
            toast.error('Something went wrong. please try again', {autoClose: 5000})
            // console.log("Error during registering", error)
            // setMessage("An error occurred while registering.")

        }
    };

    return (
        <div className="register-container">
            <h1 className="register-title">Register</h1>
            {/* {message && <p className="register-message">{message}</p>} */}
            <form className="register-form" onSubmit={handleSubmit}>
                <div className="register-form-group">
                    <label htmlFor="username" className="register-form-label">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        className="register-form-input"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="register-form-group">
                    <label htmlFor="email" className="register-form-label">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="register-form-input"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="register-form-group">
                    <label htmlFor="password" className="register-form-label">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        className="register-form-input"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="register-form-group">
                    <label htmlFor="confirmPassword" className="register-form-label">Confirm Password:</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="register-form-input"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    {passwordError && <p className="error-message">{passwordError}</p>} 
                </div>
                <button type="submit" className="register-form-button">Register</button>
                <p className="register-form-login"> Already registered ? <Link href='/signin' className="login-link">login</Link></p>
            </form>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false}/>
        </div>
    );
}
