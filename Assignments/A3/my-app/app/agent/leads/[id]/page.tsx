'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Lead {
  _id:string; name:string; email:string; phone:string; propertyInterest:string;
  budget:number; status:string; score:string; notes:string; followUpDate:string|null;
  createdAt:string; updatedAt:string;
}
interface Activity {
  _id:string; action:string; description:string; performedByName:string; createdAt:string;
  changes?:Record<string,{old:string;new:string}>;
}

const STATUSES = ['New','Contacted','Qualified','Proposal','Negotiation','Closed Won','Closed Lost'];
function formatBudget(b:number){ if(b>=1e7)return`${(b/1e7).toFixed(1)} Cr`; if(b>=1e5)return`${(b/1e5).toFixed(0)} Lac`; return b.toLocaleString(); }

export default function AgentLeadDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<Lead|null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ status:'', notes:'', followUpDate:'' });
  const [saving, setSaving] = useState(false);

  const fetchLead = useCallback(async () => {
    try {
      const res = await fetch(`/api/leads/${id}`);
      if (res.ok) {
        const d = await res.json();
        setLead(d.lead); setActivities(d.activities||[]);
        if (!isEditing) setForm({ status:d.lead.status, notes:d.lead.notes||'', followUpDate:d.lead.followUpDate?d.lead.followUpDate.slice(0,10):'' });
      } else if ([403,404].includes(res.status)) router.push('/agent/leads');
    } catch { /**/ } finally { setLoading(false); }
  }, [id, router, isEditing]);

  useEffect(() => { fetchLead(); const i = setInterval(fetchLead, 8000); return ()=>clearInterval(i); }, [fetchLead]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true);
    await fetch(`/api/leads/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ ...form, followUpDate:form.followUpDate||null }) });
    setSaving(false); setIsEditing(false); fetchLead();
  };

  if (loading) return <div style={{ display:'flex', justifyContent:'center', padding:'80px 0' }}><div className="spinner" /></div>;
  if (!lead) return <div style={{ textAlign:'center', padding:'80px 0', color:'var(--gray-400)' }}>Lead not found</div>;

  const overdue = lead.followUpDate && new Date(lead.followUpDate) < new Date();

  return (
    <div className="fade-up">
      <button onClick={() => router.back()} style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:13, color:'var(--gray-500)', background:'none', border:'none', cursor:'pointer', marginBottom:20, padding:0 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
        Back to my leads
      </button>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:20, alignItems:'start' }}>
        {/* Lead Info */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          <div className="card">
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 }}>
              <div>
                <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:22, fontWeight:800, letterSpacing:-0.5 }}>{lead.name}</h1>
                <p style={{ fontSize:13, color:'var(--gray-500)', marginTop:4 }}>{lead.email}</p>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <span className={`badge badge-${lead.score.toLowerCase()}`}>{lead.score} Priority</span>
                <span className={`badge badge-${lead.status.toLowerCase().replace(/ /g,'-')}`}>{lead.status}</span>
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, fontSize:13, marginBottom:20 }}>
              <div>
                <div style={{ fontSize:11, fontWeight:600, color:'var(--gray-400)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:4 }}>Phone</div>
                <div style={{ fontWeight:500, display:'flex', gap:8, alignItems:'center' }}>
                  {lead.phone}
                  {lead.phone && <a href={`https://wa.me/${lead.phone.replace(/[^0-9]/g,'')}`} target="_blank" rel="noreferrer" style={{ fontSize:11, fontWeight:700, color:'#10B981', background:'#ECFDF5', padding:'2px 8px', borderRadius:4, textDecoration:'none' }}>WhatsApp</a>}
                </div>
              </div>
              <div>
                <div style={{ fontSize:11, fontWeight:600, color:'var(--gray-400)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:4 }}>Budget</div>
                <div style={{ fontWeight:500 }}>PKR {formatBudget(lead.budget)}</div>
              </div>
              <div>
                <div style={{ fontSize:11, fontWeight:600, color:'var(--gray-400)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:4 }}>Property Interest</div>
                <div style={{ fontWeight:500 }}>{lead.propertyInterest}</div>
              </div>
              <div>
                <div style={{ fontSize:11, fontWeight:600, color:'var(--gray-400)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:4 }}>Follow-up Date</div>
                <div style={{ fontWeight:500, color: overdue ? '#DC2626' : 'var(--black)' }}>
                  {lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : 'Not set'}
                  {overdue && <span style={{ marginLeft:8, fontSize:11, fontWeight:700, color:'#DC2626', background:'#FEE2E2', padding:'1px 6px', borderRadius:4 }}>OVERDUE</span>}
                </div>
              </div>
            </div>

            {/* Edit form */}
            {isEditing ? (
              <form onSubmit={handleSave} style={{ borderTop:'1px solid var(--gray-100)', paddingTop:16 }}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                  <div className="form-group">
                    <label className="form-label">Update Status</label>
                    <select value={form.status} onChange={e=>setForm({...form,status:e.target.value})} className="form-select">
                      {STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Follow-up Date</label>
                    <input type="date" value={form.followUpDate} onChange={e=>setForm({...form,followUpDate:e.target.value})} className="form-input" />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom:12 }}>
                  <label className="form-label">Notes</label>
                  <textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} className="form-textarea" />
                </div>
                <div style={{ display:'flex', gap:8 }}>
                  <button type="submit" disabled={saving} className="btn btn-black btn-sm">{saving ? 'Saving...' : 'Save Changes'}</button>
                  <button type="button" onClick={()=>setIsEditing(false)} className="btn btn-ghost btn-sm">Cancel</button>
                </div>
              </form>
            ) : (
              <div style={{ borderTop:'1px solid var(--gray-100)', paddingTop:16 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                  <div style={{ fontSize:11, fontWeight:600, color:'var(--gray-400)', textTransform:'uppercase', letterSpacing:'0.05em' }}>Notes</div>
                  <button onClick={()=>setIsEditing(true)} className="btn btn-ghost btn-sm">Edit Details</button>
                </div>
                <p style={{ fontSize:13, color:'var(--gray-700)', lineHeight:1.6, whiteSpace:'pre-wrap' }}>{lead.notes || 'No notes added yet.'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="card" style={{ position:'sticky', top:80 }}>
          <div className="section-title">Activity Timeline</div>
          {activities.length === 0 ? (
            <p style={{ fontSize:13, color:'var(--gray-400)', padding:'16px 0' }}>No activity yet</p>
          ) : (
            <div style={{ marginTop:8 }}>
              {activities.map(a => (
                <div key={a._id} className="timeline-item">
                  <div className="timeline-dot" />
                  <div style={{ fontSize:13, fontWeight:600 }}>{a.description}</div>
                  <div style={{ fontSize:11, color:'var(--gray-400)', marginTop:3 }}>
                    {a.performedByName} · {new Date(a.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
