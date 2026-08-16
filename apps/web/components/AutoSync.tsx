'use client';

import {useEffect} from 'react';
import {cloudFetch,getToken,readLocalState} from '../lib/cloud';

export default function AutoSync(){
  useEffect(()=>{
    let timer:ReturnType<typeof setTimeout>|undefined;
    let syncing=false;
    let queued=false;

    const upload=async()=>{
      if(!getToken())return;
      if(syncing){queued=true;return}
      syncing=true;
      try{await cloudFetch('/sync',{method:'PUT',body:JSON.stringify(readLocalState())})}
      catch{/* The local copy remains authoritative while offline. */}
      finally{
        syncing=false;
        if(queued){queued=false;schedule()}
      }
    };
    const schedule=()=>{
      if(timer)clearTimeout(timer);
      timer=setTimeout(upload,700);
    };
    const storage=(event:StorageEvent)=>{
      if(event.key?.startsWith('dts-')&&event.key!=='dts-auth-v1')schedule();
    };
    window.addEventListener('dts-state-changed',schedule);
    window.addEventListener('storage',storage);
    return()=>{
      if(timer)clearTimeout(timer);
      window.removeEventListener('dts-state-changed',schedule);
      window.removeEventListener('storage',storage);
    };
  },[]);
  return null;
}
