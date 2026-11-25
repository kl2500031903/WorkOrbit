import {useState} from 'react';import {Link,Navigate,useLocation,useNavigate} from 'react-router-dom';
import {getUsers,saveUsers} from '../store.js';import {useAuth} from '../App.jsx';
const EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export default function Auth({mode}){
 const signup=mode==='signup',nav=useNavigate(),{state}=useLocation(),{user,login}=useAuth();
 const [name,setName]=useState(''),[email,setEmail]=useState(''),[password,setPassword]=useState(''),[err,setErr]=useState('');
 if(user)return <Navigate to={user.role==='admin'?'/admin/dashboard':'/user/dashboard'} replace/>; // session persists after refresh
 function onSignup(e){e.preventDefault();
  if(!name.trim()||!email.trim()||!password)return setErr('Please fill in all fields.');
  if(!EMAIL.test(email.trim()))return setErr('Please enter a valid email address.');
  if(password.length<6)return setErr('Password must contain at least 6 characters.');
  const users=getUsers();
  if(users.find(u=>u.email.toLowerCase()===email.trim().toLowerCase()))return setErr('An account with this email already exists.');
  users.push({id:Date.now().toString(),name:name.trim(),email:email.trim(),password,role:'user'});saveUsers(users);
  nav('/login',{state:{msg:'Account created successfully! Please login.'}});}
 function onLogin(e){e.preventDefault();
  if(!email.trim()||!password)return setErr('Please enter email and password.');
  const u=getUsers().find(u=>u.email.toLowerCase()===email.trim().toLowerCase()&&u.password===password);
  if(!u)return setErr('Invalid email or password.');
  login(u);nav(u.role==='admin'?'/admin/dashboard':'/user/dashboard');}
 return <div className="auth"><form className="card auth-box" onSubmit={signup?onSignup:onLogin} noValidate>
  <Link to="/" className="brand"><i className="brand-icon">✓</i>WorkOrbit</Link>
  <h2>{signup?'Create Account':'Login'}</h2>
  {!signup&&state?.msg&&<div className="success-msg">{state.msg}</div>}{err&&<div className="error">{err}</div>}
  {signup&&<input placeholder="Full name" value={name} onChange={e=>setName(e.target.value)}/>}
  <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
  <input type="password" placeholder={signup?'Password (min 6 characters)':'Password'} value={password} onChange={e=>setPassword(e.target.value)}/>
  <button className="btn">{signup?'Create Account':'Login to WorkOrbit'}</button>
  {!signup&&<small className="note">Demo Admin: admin@task.com / admin123</small>}
  <p>{signup?'Already have an account?':"Don't have an account?"} <Link to={signup?'/login':'/signup'}>{signup?'Login':'Create Account'}</Link></p></form></div>;}
