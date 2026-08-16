export const API='';
export const AUTH_KEY='dts-auth-v1';
export type CloudState={collection:string[];team:string[];favorites:string[];settings:Record<string,unknown>;updatedAt?:string};
export function getToken(){if(typeof window==='undefined')return '';return localStorage.getItem(AUTH_KEY)??''}
export function setToken(v:string){localStorage.setItem(AUTH_KEY,v)}
export function clearToken(){localStorage.removeItem(AUTH_KEY)}
export async function cloudFetch<T>(path:string,init:RequestInit={}){const headers=new Headers(init.headers);headers.set('content-type','application/json');const token=getToken();if(token)headers.set('authorization',`Bearer ${token}`);const r=await fetch(`${API}/api${path}`,{...init,headers});const body=await r.json().catch(()=>({}));if(!r.ok)throw new Error(body.message??`HTTP ${r.status}`);return body as T}
export function readLocalState():CloudState{const parse=(k:string,d:any)=>{try{return JSON.parse(localStorage.getItem(k)??JSON.stringify(d))}catch{return d}};return{collection:parse('dts-collection-v1',[]),team:parse('dts-team-v1',[]),favorites:parse('dts-favorites-v1',[]),settings:parse('dts-settings-v1',{})}}
export function writeLocalState(s:Partial<CloudState>){if(s.collection)localStorage.setItem('dts-collection-v1',JSON.stringify(s.collection));if(s.team)localStorage.setItem('dts-team-v1',JSON.stringify(s.team));if(s.favorites)localStorage.setItem('dts-favorites-v1',JSON.stringify(s.favorites));if(s.settings)localStorage.setItem('dts-settings-v1',JSON.stringify(s.settings));window.dispatchEvent(new Event('dts-state-changed'))}
export function stateHasData(s:CloudState){return s.collection.length>0||s.team.some(Boolean)||s.favorites.length>0||Object.keys(s.settings).length>0}
export async function initializeCloudState(mode:'login'|'register'){
  const local=readLocalState();
  if(mode==='register'){
    await cloudFetch('/sync',{method:'PUT',body:JSON.stringify(local)});
    return 'Local progress saved to your new account.';
  }
  const remote=await cloudFetch<CloudState>('/sync');
  if(stateHasData(remote)){
    writeLocalState(remote);
    return 'Cloud progress restored automatically.';
  }
  if(stateHasData(local)){
    await cloudFetch('/sync',{method:'PUT',body:JSON.stringify(local)});
    return 'Local progress saved to your account.';
  }
  return 'Signed in. Automatic sync is active.';
}
