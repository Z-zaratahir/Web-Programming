'use client';
import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Lead {
  _id:string; name:string; email:string; phone:string; propertyInterest:string;
  budget:number; status:string; score:string; notes:string; followUpDate:string|null;
  assignedTo:{_id:string;name:string;email:string}|null; createdAt:string; updatedAt:string;
}
interface Activity {
  _id:string; action:string; description:string; performedByName:string; createdAt:string;
  changes?:Record<string,{old:string;new:string}>;
}

function formatBudget(b:number){ if(b>=1e7)return`${(b/1e7).toFixed(1)} Cr`; if(b>=1e5)return`${(b/1e5).toFixed(0)} Lac`; return b.toLocaleString(); }

export default function AdminLeadDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<Lead|null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [sugLoading, setSugLoading] = useState(false);

  const fetchLead = useCallback(async () => {
    try {
      const res = await fetch(`/api/leads/${id}`);
      if (res.ok) { const d = await res.json(); setLead(d.lead); setActivities(d.activities||[]); }
      else if (res.status === 403 || res.status === 404) router.push('/admin/leads');
    } catch { /**/ } finally { setLoading(false); }
  }, [id, router]);

  useEffect(() => { fetchLead(); const i = setInterval(fetchLead, 8000); return ()=>clearInterval(i); }, [fetchLead]);

  const getSuggestions = async () => {
    if (!lead) return;
    setSugLoading(true);
    try {
      const daysSince = Math.floor((Date.now()-new Date(lead.updatedAt).getTime())/86400000);
      const res = await fetch('/api/leads/ai-suggestions', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ leadName:lead.name, status:lead.status, score:lead.score, budget:lead.budget, propertyInterest:lead.propertyInterest, daysSinceLastActivity:daysSince, notes:lead.notes }) });
      if (res.ok) { const d = await res.json(); setSuggestions(d.suggestions); }
    } catch { /**/ } finally { setSugLoading(false); }
  };

  if (loading) return <div style={{ display:'flex', justifyContent:'center', padding:'80px 0' }}><div className="spinner" /></div>;
  if (!lead) return <div style={{ textAlign:'center', padding:'80px 0', color:'var(--gray-400)' }}>Lead not found</div>;

  const overdue = lead.followUpDate && new Date(lead.followUpDate) < new Date();

  return (
    <div className="fade-up">
      <button onClick={() => router.back()} style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:13, color:'var(--gray-500)', background:'none', border:'none', cursor:'pointer', marginBottom:20, padding:0 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
        Back to leads
      </button>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:20, alignItems:'start' }}>
        {/* Main */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {/* Lead Info Card */}
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

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, fontSize:13 }}>
              {[
                ['Phone', lead.phone],
                ['Budget', `PKR ${formatBudget(lead.budget)}`],
                ['Property Interest', lead.propertyInterest],
                ['Assigned To', lead.assignedTo?.name || 'Unassigned'],
                ['Created', new Date(lead.createdAt).toLocaleDateString()],
                ['Follow-up', lead.followUpDate ? new Date(lead.followUpDate).toLocaleDateString() : 'Not set'],
              ].map(([k,v]) => (
                <div key={k}>
                  <div style={{ fontSize:11, fontWeight:600, color:'var(--gray-400)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:4 }}>{k}</div>
                  <div style={{ fontWeight:500, color: k === 'Follow-up' && overdue ? '#DC2626' : 'var(--black)' }}>
                    {v}
                    {k === 'Follow-up' && overdue && <span style={{ marginLeft:8, fontSize:11, fontWeight:700, color:'#DC2626', background:'#FEE2E2', padding:'1px 6px', borderRadius:4 }}>OVERDUE</span>}
                    {k === 'Phone' && lead.phone && (
                      <a href={`https://wa.me/${lead.phone.replace(/[^0-9]/g,'')}`} target="_blank" rel="noreferrer"
                        style={{ marginLeft:10, fontSize:11, fontWeight:700, color:'#10B981', background:'#ECFDF5', padding:'2px 8px', borderRadius:4, textDecoration:'none' }}>
                        WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {lead.notes && (
              <div style={{ marginTop:20, paddingTop:16, borderTop:'1px solid var(--gray-100)' }}>
                <div style={{ fontSize:11, fontWeight:600, color:'var(--gray-400)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:8 }}>Notes</div>
                <p style={{ fontSize:13, color:'var(--gray-700)', lineHeight:1.6, whiteSpace:'pre-wrap' }}>{lead.notes}</p>
              </div>
            )}
          </div>

          {/* AI Suggestions */}
          <div className="card">
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <div>
                <div className="section-title" style={{ marginBottom:2 }}>AI Follow-up Suggestions</div>
                <p style={{ fontSize:12, color:'var(--gray-400)' }}>Smart recommendations based on lead context</p>
              </div>
              <button onClick={getSuggestions} disabled={sugLoading} className="btn btn-primary btn-sm">
                {sugLoading ? 'Generating...' : 'Generate'}
              </button>
            </div>
            {suggestions.length > 0 ? (
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                {suggestions.map((s,i) => (
                  <div key={i} style={{ display:'flex', gap:12, alignItems:'flex-start', padding:'10px 14px', background:'var(--gray-50)', borderRadius:8, fontSize:13 }}>
                    <span style={{ fontWeight:800, color:'var(--accent)', minWidth:18, fontSize:12 }}>{i+1}.</span>
                    <span style={{ color:'var(--gray-700)', lineHeight:1.5 }}>{s}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ fontSize:13, color:'var(--gray-400)' }}>Click Generate to get AI-powered follow-up suggestions.</p>
            )}
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="card" style={{ position:'sticky', top:80 }}>
          <div className="section-title">Activity Timeline</div>
          {activities.length === 0 ? (
            <p style={{ fontSize:13, color:'var(--gray-400)', padding:'16px 0' }}>No activity recorded yet</p>
          ) : (
            <div style={{ marginTop:8 }}>
              {activities.map((a) => (
                <div key={a._id} className="timeline-item">
                  <div className="timeline-dot" />
                  <div style={{ fontSize:13, fontWeight:600, color:'var(--black)' }}>{a.description}</div>
                  <div style={{ fontSize:11, color:'var(--gray-400)', marginTop:3 }}>
                    {a.performedByName} · {new Date(a.createdAt).toLocaleString()}
                  </div>
                  {a.changes && Object.keys(a.changes).length > 0 && (
                    <div style={{ marginTop:6, display:'flex', flexDirection:'column', gap:4 }}>
                      {Object.entries(a.changes).map(([field, ch]) => (
                        <div key={field} style={{ fontSize:11, background:'var(--gray-50)', padding:'4px 8px', borderRadius:6 }}>
                          <span style={{ color:'var(--gray-400)', textTransform:'capitalize' }}>{field}:</span>{' '}
                          <span style={{ textDecoration:'line-through', color:'#DC2626' }}>{String(ch.old||'—')}</span>
                          {' → '}
                          <span style={{ color:'#059669', fontWeight:600 }}>{String(ch.new)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
