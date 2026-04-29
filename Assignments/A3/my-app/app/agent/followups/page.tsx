'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Lead {
  _id:string; name:string; phone:string; propertyInterest:string;
  status:string; score:string; followUpDate:string|null; lastActivityAt:string;
}

export default function AgentFollowUps() {
  const [data, setData] = useState<{overdue:Lead[];upcoming:Lead[];stale:Lead[]}|null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try { const res = await fetch('/api/leads/followups'); if (res.ok) { const d = await res.json(); setData(d.categorized); } }
    catch { /**/ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (loading) return <div style={{ display:'flex', justifyContent:'center', padding:'80px 0' }}><div className="spinner" /></div>;
  if (!data) return <div style={{ textAlign:'center', color:'var(--gray-400)', padding:'80px 0' }}>Failed to load</div>;

  const renderSection = (title: string, leads: Lead[], type: 'overdue'|'upcoming'|'stale') => {
    const color = type==='overdue' ? '#DC2626' : type==='upcoming' ? '#059669' : 'var(--gray-400)';
    return (
      <div className="card" style={{ padding:0, overflow:'hidden', marginBottom:16 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 20px', borderBottom:'1px solid var(--gray-100)' }}>
          <div style={{ fontWeight:700, fontSize:14, color }}>{title}</div>
          <span className="badge" style={{ background:'var(--gray-100)', color:'var(--gray-700)' }}>{leads.length}</span>
        </div>
        {leads.length === 0 ? (
          <p style={{ padding:'20px', fontSize:13, color:'var(--gray-400)' }}>No {type} leads found.</p>
        ) : (
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>
                {['Lead','Phone','Status','Date'].map(h => (
                  <th key={h} style={{ textAlign:'left', padding:'10px 16px', fontSize:11, fontWeight:600, color:'var(--gray-400)', textTransform:'uppercase', letterSpacing:'0.05em', borderBottom:'1px solid var(--gray-100)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead._id} style={{ borderBottom:'1px solid var(--gray-100)' }}>
                  <td style={{ padding:'12px 16px' }}>
                    <Link href={`/agent/leads/${lead._id}`} style={{ fontWeight:600, color:'var(--black)', textDecoration:'none', fontSize:13 }}>{lead.name}</Link>
                    <div style={{ fontSize:11, color:'var(--gray-400)', marginTop:2 }}>{lead.propertyInterest}</div>
                  </td>
                  <td style={{ padding:'12px 16px', fontSize:12, color:'var(--gray-500)' }}>{lead.phone}</td>
                  <td style={{ padding:'12px 16px' }}><span className={`badge badge-${lead.status.toLowerCase().replace(/ /g,'-')}`}>{lead.status}</span></td>
                  <td style={{ padding:'12px 16px', fontSize:12, fontWeight:600, color }}>
                    {type==='stale' ? new Date(lead.lastActivityAt).toLocaleDateString() : lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  return (
    <div className="fade-up">
      <div className="page-header">
        <h1 className="page-title">My Follow-ups</h1>
        <p className="page-subtitle">Stay on top of your lead interactions</p>
      </div>
      {renderSection('Overdue Follow-ups', data.overdue, 'overdue')}
      {renderSection('Upcoming — Next 3 Days', data.upcoming, 'upcoming')}
    </div>
  );
}
