import {useState} from 'react';import {Link,Navigate,useNavigate,useParams} from 'react-router-dom';
import {getTasks,saveTasks} from '../store.js';import {useAuth} from '../App.jsx';
export default function AddTask(){
 const {user}=useAuth(),nav=useNavigate(),{id}=useParams();
 const old=id?getTasks().find(t=>t.id===id&&t.userId===user.id):null;
 const [f,setF]=useState(old?{title:old.title,description:old.description||'',project:old.project,deadline:old.deadline,priority:old.priority,status:old.status}
  :{title:'',description:'',project:'',deadline:'',priority:'Medium',status:'pending'});
 const [err,setErr]=useState('');const set=k=>e=>setF({...f,[k]:e.target.value});
 if(id&&!old)return <Navigate to="/user/dashboard" replace/>;
 function submit(e){e.preventDefault();
  if(!f.title.trim()||!f.project.trim()||!f.deadline)return setErr('Please fill all required fields.');
  const clean={...f,title:f.title.trim(),description:f.description.trim(),project:f.project.trim()},tasks=getTasks();
  if(old)saveTasks(tasks.map(t=>t.id===id?{...t,...clean}:t));
  else saveTasks([...tasks,{id:Date.now().toString(),userId:user.id,userName:user.name,...clean,sharedWith:[],createdAt:new Date().toISOString()}]);
  nav('/user/dashboard',{state:{msg:old?'Task updated successfully!':'Task created successfully!'}});}
 return <div className="auth"><form className="card auth-box" onSubmit={submit}>
  <h2>{old?'Edit Task':'Add Task'}</h2>{err&&<div className="error">{err}</div>}
  <input placeholder="Title *" value={f.title} onChange={set('title')}/>
  <textarea placeholder="Description" value={f.description} onChange={set('description')}/>
  <input placeholder="Project *" value={f.project} onChange={set('project')}/>
  <input type="date" value={f.deadline} onChange={set('deadline')}/>
  <select value={f.priority} onChange={set('priority')}><option>High</option><option>Medium</option><option>Low</option></select>
  <select value={f.status} onChange={set('status')}><option value="pending">Pending</option><option value="completed">Completed</option></select>
  <button className="btn">{old?'Save Changes':'Create Task'}</button><Link to="/user/dashboard" className="note">← Back to dashboard</Link></form></div>;}
