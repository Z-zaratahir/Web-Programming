'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Lead {
  _id:string; name:string; email:string; phone:string; propertyInterest:string;
  budget:number; status:string; score:string; followUpDate:string|null;
}

const STATUSES = ['New','Contacted','Qualified','Proposal','Negotiation','Closed Won','Closed Lost'];
function formatBudget(b:number){ if(b>=1e7)return`${(b/1e7).toFixed(1)} Cr`; if(b>=1e5)return`${(b/1e5).toFixed(0)} L`; return b.toLocaleString(); }

export default function AgentLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status:'', priority:'', search:'' });

  const fetchLeads = useCallback(async () => {
    const p = new URLSearchParams();
    if (filters.status)   p.set('status',   filters.status);
    if (filters.priority) p.set('priority',  filters.priority);
    if (filters.search)   p.set('search',    filters.search);
    try {
      const res = await fetch(`/api/leads?${p}`);
      if (res.ok) { const d = await res.json(); setLeads(d.leads); }
    } catch { /**/ } finally { setLoading(false); }
  }, [filters]);

  useEffect(() => { fetchLeads(); const id = setInterval(fetchLeads, 8000); return () => clearInterval(id); }, [fetchLeads]);

  const quickStatus = async (leadId:string, status:string) => {
    await fetch(`/api/leads/${leadId}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ status }) });
    fetchLeads();
  };

  return (
    <div className="fade-up">
      <div className="page-header">
        <h1 className="page-title">My Leads</h1>
        <p className="page-subtitle">Leads assigned to you</p>
      </div>

      <div className="filter-bar">
        <input className="filter-search" placeholder="Search by name, email, property..." value={filters.search} onChange={e => setFilters({...filters, search:e.target.value})} />
        <select className="filter-select" value={filters.status} onChange={e => setFilters({...filters, status:e.target.value})}>
          <option value="">All Statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="filter-select" value={filters.priority} onChange={e => setFilters({...filters, priority:e.target.value})}>
          <option value="">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', padding:'60px 0' }}><div className="spinner" /></div>
      ) : leads.length === 0 ? (
        <div className="card" style={{ textAlign:'center', padding:'60px 24px', color:'var(--gray-400)' }}>
          No leads assigned to you yet.
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th><th>Contact</th><th>Property Interest</th>
                <th>Budget</th><th>Priority</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead._id}>
                  <td>
                    <Link href={`/agent/leads/${lead._id}`} style={{ fontWeight:600, color:'var(--black)', textDecoration:'none' }}>
                      {lead.name}
                    </Link>
                    {lead.followUpDate && new Date(lead.followUpDate) < new Date() && (
                      <span style={{ marginLeft:6, fontSize:10, fontWeight:700, color:'#DC2626', background:'#FEE2E2', padding:'1px 5px', borderRadius:4 }}>OVERDUE</span>
                    )}
                  </td>
                  <td>
                    <div style={{ fontSize:12 }}>{lead.email}</div>
                    <div style={{ display:'flex', gap:6, alignItems:'center', marginTop:2 }}>
                      <span style={{ fontSize:12, color:'var(--gray-400)' }}>{lead.phone}</span>
                      {lead.phone && (
                        <a href={`https://wa.me/${lead.phone.replace(/[^0-9]/g,'')}`} target="_blank" rel="noreferrer"
                          style={{ fontSize:11, fontWeight:700, color:'#10B981', background:'#ECFDF5', padding:'1px 6px', borderRadius:4, textDecoration:'none' }}>
                          WhatsApp
                        </a>
                      )}
                    </div>
                  </td>
                  <td style={{ fontSize:12, maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{lead.propertyInterest}</td>
                  <td style={{ fontWeight:600, fontSize:12 }}>PKR {formatBudget(lead.budget)}</td>
                  <td><span className={`badge badge-${lead.score.toLowerCase()}`}>{lead.score}</span></td>
                  <td>
                    <select value={lead.status} onChange={e => quickStatus(lead._id, e.target.value)} className="filter-select" style={{ padding:'4px 6px', fontSize:12 }}>
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
