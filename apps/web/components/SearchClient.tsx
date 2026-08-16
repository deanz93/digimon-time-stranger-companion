'use client';
import { useState } from 'react';
import Link from 'next/link';

type Digimon = { id:number; name:string; slug:string; stage:string; attribute:string; type?:string };

export default function SearchClient() {
  const [q,setQ] = useState('');
  const [items,setItems] = useState<Digimon[]>([]);

  async function search(value:string) {
    setQ(value);
    if (!value.trim()) return setItems([]);
    const base = '';
    const r = await fetch(`${base}/api/digimon?q=${encodeURIComponent(value)}`);
    setItems(await r.json());
  }

  return <div>
    <input value={q} onChange={e=>search(e.target.value)} placeholder="Search Digimon…" aria-label="Search Digimon" />
    {items.length > 0 && <div className="grid" style={{marginTop:14}}>{items.map(d=><Link className="card" href={`/digimon/${d.slug}`} key={d.id}>
      <strong>{d.name}</strong><div style={{marginTop:8}}><span className="badge">{d.stage}</span><span className="badge">{d.attribute}</span></div>
    </Link>)}</div>}
  </div>;
}
