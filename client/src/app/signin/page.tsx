"use client";
import React, { useState } from 'react';
import { useRouter} from 'next/navigation';
import Link from 'next/link';
import { ToastContainer,toast } from 'react-toastify';
import { AuthContext } from '@/context/AuthContext';
import 'react-toastify/dist/ReactToastify.css';
import '../../styles/signin.css';

function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router=useRouter()
  const {login}=React.useContext(AuthContext)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/signin', {
        method:'POST',
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            email,
            password
        })
      });
      const data = await response.json();
      console.log("Response data:", data); 
      if(response.ok){
        toast.success("Login successfully",{
            autoClose:5000,
            onClose:()=>{
              login(data.user);
              router.push('/')
            }
        })
        setEmail('')
        setPassword('')
      }else{
        toast.error(data.message,{autoClose:5000});
      }
      
    } catch (error: any) {
      toast.error('something went wrong',{autoClose:5000})
    }
  };

  return (
    <div className='login-container'>
      <h1 className='login-title'>Sign In</h1>
      <form onSubmit={handleSubmit} className='login-form'>
        <div className='login-form-group'>
          <label className='login-form-label'>Email:</label>
          <input
            type="email"
            value={email}
            className='login-form-input'
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className='login-form-group'>
          <label className='login-form-label'>Password:</label>
          <input
            type="password"
            value={password}
            className='login-form-input'
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit"className='login-form-button'>Sign In</button>
        <p className='login-form-register'> Don't have account? please register here <Link href='/register' className='register-link'>register</Link></p>
      </form>
      <ToastContainer position='top-right' autoClose={5000} hideProgressBar={false}/>
    </div>
  );
}

export default Signin;