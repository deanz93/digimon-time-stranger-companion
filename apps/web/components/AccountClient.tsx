'use client';
import {useEffect,useState} from 'react';
import {clearToken,cloudFetch,getToken,initializeCloudState,setToken} from '../lib/cloud';
type User={id:string;username:string;createdAt:string};

export default function AccountClient(){
  const[user,setUser]=useState<User|null>(null);
  const[username,setUsername]=useState('');
  const[password,setPassword]=useState('');
  const[msg,setMsg]=useState('');
  const[busy,setBusy]=useState(false);
  useEffect(()=>{if(getToken())cloudFetch<User>('/auth/me').then(setUser).catch(()=>clearToken())},[]);

  async function auth(mode:'login'|'register'){
    setBusy(true);setMsg('');
    try{
      const result=await cloudFetch<{user:User;token:string}>(`/auth/${mode}`,{method:'POST',body:JSON.stringify({username,password})});
      setToken(result.token);
      setUser(result.user);
      setPassword('');
      setMsg(await initializeCloudState(mode));
    }catch(error:unknown){setMsg(error instanceof Error?error.message:'Unable to sign in.')}
    finally{setBusy(false)}
  }
  async function logout(){try{await cloudFetch('/auth/logout',{method:'POST'})}catch{}clearToken();setUser(null);setMsg('Signed out. Your local copy remains on this device.')}

  return <div className="card">{user?<><div className="sync-status"><span className="sync-dot"/><div><h2 style={{margin:0}}>{user.username}</h2><p className="muted" style={{margin:'5px 0 0'}}>Automatic cloud sync is active</p></div></div><p className="muted">Collection, team, favorites and settings are saved automatically whenever they change.</p><button onClick={logout}>Sign out</button></>:<><h2>Cloud Sync</h2><p className="muted">Sign in once. Progress is restored and saved automatically across your devices.</p><label>Username<input value={username} onChange={e=>setUsername(e.target.value)} autoComplete="username"/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password"/></label><div className="path" style={{marginTop:12}}><button className="primary" disabled={busy} onClick={()=>auth('login')}>{busy?'Please wait…':'Sign in'}</button><button disabled={busy} onClick={()=>auth('register')}>Create account</button></div></>}{msg&&<p className="warning" style={{marginTop:14}}>{msg}</p>}</div>;
}
