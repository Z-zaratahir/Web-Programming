'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Lead {
  _id:string; name:string; phone:string; propertyInterest:string; notes?:string;
  status:string; score:string; followUpDate:string|null; lastActivityAt:string;
  assignedTo:{name:string}|null;
}

function Row({ lead, type }: { lead:Lead; type:'overdue'|'upcoming'|'stale' }) {
  const color = type==='overdue'?'#DC2626': type==='upcoming'?'#059669':'var(--gray-400)';
  const date = type==='stale' ? new Date(lead.lastActivityAt).toLocaleDateString() : lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : '—';
  return (
    <tr>
      <td>
        <Link href={`/admin/leads/${lead._id}`} style={{ fontWeight:600, color:'var(--black)', textDecoration:'none' }}>{lead.name}</Link>
        <div style={{ fontSize:12, color:'var(--gray-400)', marginTop:2 }}>{lead.propertyInterest}</div>
      </td>
      <td style={{ fontSize:12 }}>{lead.phone}</td>
      <td>
        <span className={`badge badge-${lead.status.toLowerCase().replace(/ /g,'-')}`}>{lead.status}</span>
        <span className={`badge badge-${lead.score.toLowerCase()}`} style={{ marginLeft:6 }}>{lead.score}</span>
      </td>
      <td style={{ fontWeight:600, fontSize:12, color }}>{date}</td>
      <td style={{ fontSize:12 }}>{lead.assignedTo?.name || 'Unassigned'}</td>
    </tr>
  );
}

function Section({ title, leads, type, colorClass }: { title:string; leads:Lead[]; type:'overdue'|'upcoming'|'stale'; colorClass:string }) {
  return (
    <div className="card" style={{ padding:0, overflow:'hidden', marginBottom:16 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px', borderBottom:'1px solid var(--gray-100)' }} className={colorClass}>
        <div style={{ fontWeight:700, fontSize:14 }}>{title}</div>
        <span className="badge" style={{ background:'rgba(0,0,0,0.08)', color:'var(--black)' }}>{leads.length}</span>
      </div>
      {leads.length === 0 ? (
        <p style={{ padding:'20px', fontSize:13, color:'var(--gray-400)' }}>No {type} leads found.</p>
      ) : (
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign:'left', padding:'10px 16px', fontSize:11, fontWeight:600, color:'var(--gray-400)', textTransform:'uppercase', letterSpacing:'0.05em' }}>Lead</th>
              <th style={{ textAlign:'left', padding:'10px 16px', fontSize:11, fontWeight:600, color:'var(--gray-400)', textTransform:'uppercase', letterSpacing:'0.05em' }}>Phone</th>
              <th style={{ textAlign:'left', padding:'10px 16px', fontSize:11, fontWeight:600, color:'var(--gray-400)', textTransform:'uppercase', letterSpacing:'0.05em' }}>Status</th>
              <th style={{ textAlign:'left', padding:'10px 16px', fontSize:11, fontWeight:600, color:'var(--gray-400)', textTransform:'uppercase', letterSpacing:'0.05em' }}>{type==='stale'?'Last Activity':'Follow-up Date'}</th>
              <th style={{ textAlign:'left', padding:'10px 16px', fontSize:11, fontWeight:600, color:'var(--gray-400)', textTransform:'uppercase', letterSpacing:'0.05em' }}>Agent</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(l => <Row key={l._id} lead={l} type={type} />)}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default function AdminFollowUps() {
  const [data, setData] = useState<{overdue:Lead[];upcoming:Lead[];stale:Lead[]}|null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try { const res = await fetch('/api/leads/followups'); if (res.ok) { const d = await res.json(); setData(d.categorized); } }
    catch { /**/ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <div style={{ display:'flex', justifyContent:'center', padding:'80px 0' }}><div className="spinner" /></div>;
  if (!data) return <div style={{ textAlign:'center', color:'var(--gray-400)', padding:'80px 0' }}>Failed to load</div>;

  return (
    <div className="fade-up">
      <div className="page-header">
        <h1 className="page-title">Smart Follow-ups</h1>
        <p className="page-subtitle">Overdue, upcoming, and stale lead alerts</p>
      </div>
      <Section title="Overdue Follow-ups" leads={data.overdue} type="overdue" colorClass="" />
      <Section title="Upcoming — Next 3 Days" leads={data.upcoming} type="upcoming" colorClass="" />
      <Section title="Stale Leads — No Activity 7+ Days" leads={data.stale} type="stale" colorClass="" />
    </div>
  );
}
