'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Lead {
  _id: string; name: string; email: string; phone: string; propertyInterest: string;
  budget: number; status: string; score: string; notes: string; followUpDate: string | null;
  assignedTo: { _id: string; name: string } | null; createdAt: string;
}
interface Agent { _id: string; name: string; email: string; }

const STATUSES = ['New','Contacted','Qualified','Proposal','Negotiation','Closed Won','Closed Lost'];

function ScoreBadge({ score }: { score: string }) {
  return <span className={`badge badge-${score.toLowerCase()}`}>{score}</span>;
}
function StatusBadge({ status }: { status: string }) {
  const cls = status.toLowerCase().replace(/ /g,'-');
  return <span className={`badge badge-${cls}`}>{status}</span>;
}
function formatBudget(b: number) {
  if (b >= 1e7) return `${(b/1e7).toFixed(1)} Cr`;
  if (b >= 1e5) return `${(b/1e5).toFixed(0)} L`;
  return b.toLocaleString();
}

const EMPTY_FORM = { name:'', email:'', phone:'', propertyInterest:'', budget:'', notes:'', assignedTo:'', followUpDate:'' };

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string|null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [formErr, setFormErr] = useState('');
  const [filters, setFilters] = useState({ status:'', priority:'', search:'', assignedTo:'' });

  const fetchLeads = useCallback(async () => {
    const p = new URLSearchParams();
    Object.entries(filters).forEach(([k,v]) => { if (v) p.set(k === 'priority' ? 'priority' : k, v); });
    try {
      const res = await fetch(`/api/leads?${p}`);
      if (res.ok) { const d = await res.json(); setLeads(d.leads); setTotal(d.total); }
    } catch { /**/ } finally { setLoading(false); }
  }, [filters]);

  const fetchAgents = useCallback(async () => {
    try { const res = await fetch('/api/agents'); if (res.ok) { const d = await res.json(); setAgents(d.agents); } } catch { /**/ }
  }, []);

  useEffect(() => { fetchAgents(); }, [fetchAgents]);
  useEffect(() => { fetchLeads(); const id = setInterval(fetchLeads, 8000); return () => clearInterval(id); }, [fetchLeads]);

  const openCreate = () => { setForm({ ...EMPTY_FORM }); setEditId(null); setFormErr(''); setShowModal(true); };
  const openEdit = (l: Lead) => {
    setForm({ name:l.name, email:l.email, phone:l.phone, propertyInterest:l.propertyInterest, budget:String(l.budget), notes:l.notes||'', assignedTo:l.assignedTo?._id||'', followUpDate:l.followUpDate?l.followUpDate.slice(0,10):'' });
    setEditId(l._id); setFormErr(''); setShowModal(true);
  };
  const closeModal = () => { setShowModal(false); setEditId(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setFormErr('');
    const payload = { ...form, budget: Number(form.budget), assignedTo: form.assignedTo||null, followUpDate: form.followUpDate||null };
    try {
      const res = await fetch(editId ? `/api/leads/${editId}` : '/api/leads', { method: editId ? 'PUT' : 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      closeModal(); fetchLeads();
    } catch (err: unknown) { setFormErr(err instanceof Error ? err.message : 'Error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this lead permanently?')) return;
    await fetch(`/api/leads/${id}`, { method: 'DELETE' });
    fetchLeads();
  };

  const quickStatus = async (id: string, status: string) => {
    await fetch(`/api/leads/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ status }) });
    fetchLeads();
  };

  const quickAssign = async (id: string, agentId: string) => {
    await fetch(`/api/leads/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ assignedTo: agentId||null }) });
    fetchLeads();
  };

  const exportExcel = async () => {
    const res = await fetch('/api/leads/export?format=excel');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'leads.xlsx'; a.click();
  };

  const exportPDF = async () => {
    const res = await fetch('/api/leads/export?format=pdf');
    const { data } = await res.json();
    const { jsPDF } = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;
    const doc = new jsPDF('l', 'mm', 'a4');
    doc.setFontSize(16); doc.text('PropCRM — Leads Export', 14, 18);
    doc.setFontSize(10); doc.setTextColor(150); doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 26);
    autoTable(doc, { startY: 32, head: [Object.keys(data[0]||{})], body: data.map((r:Record<string,string>) => Object.values(r)), styles: { fontSize: 8 }, headStyles: { fillColor: [0, 207, 189], textColor: [0,0,0] } });
    doc.save('leads.pdf');
  };

  return (
    <div className="fade-up">
      {/* Header */}
      <div className="page-header" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 className="page-title">All Leads</h1>
          <p className="page-subtitle">{total} total leads</p>
        </div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          <button onClick={exportExcel} className="btn btn-ghost btn-sm">Export Excel</button>
          <button onClick={exportPDF} className="btn btn-ghost btn-sm">Export PDF</button>
          <button onClick={openCreate} className="btn btn-primary">+ New Lead</button>
        </div>
      </div>

      {/* Filters */}
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
        <select className="filter-select" value={filters.assignedTo} onChange={e => setFilters({...filters, assignedTo:e.target.value})}>
          <option value="">All Agents</option>
          {agents.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ display:'flex', justifyContent:'center', padding:'60px 0' }}><div className="spinner" /></div>
      ) : leads.length === 0 ? (
        <div className="card" style={{ textAlign:'center', padding:'60px 24px', color:'var(--gray-400)' }}>
          No leads found. Create your first lead to get started.
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th><th>Contact</th><th>Property Interest</th><th>Budget</th>
                <th>Priority</th><th>Status</th><th>Assigned To</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead._id}>
                  <td>
                    <Link href={`/admin/leads/${lead._id}`} style={{ fontWeight:600, color:'var(--black)', textDecoration:'none' }}
                      onMouseEnter={e => (e.target as HTMLElement).style.color='var(--accent)'}
                      onMouseLeave={e => (e.target as HTMLElement).style.color='var(--black)'}>
                      {lead.name}
                    </Link>
                    {lead.followUpDate && new Date(lead.followUpDate) < new Date() && (
                      <span style={{ marginLeft:6, fontSize:10, fontWeight:700, color:'#DC2626', background:'#FEE2E2', padding:'1px 5px', borderRadius:4 }}>OVERDUE</span>
                    )}
                  </td>
                  <td>
                    <div style={{ fontSize:12, color:'var(--gray-700)' }}>{lead.email}</div>
                    <div style={{ fontSize:12, color:'var(--gray-400)', marginTop:2, display:'flex', gap:6, alignItems:'center' }}>
                      {lead.phone}
                      {lead.phone && (
                        <a href={`https://wa.me/${lead.phone.replace(/[^0-9]/g,'')}`} target="_blank" rel="noreferrer"
                          style={{ fontSize:11, fontWeight:700, color:'#10B981', textDecoration:'none', background:'#ECFDF5', padding:'1px 6px', borderRadius:4 }}>
                          WhatsApp
                        </a>
                      )}
                    </div>
                  </td>
                  <td style={{ maxWidth:160, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{lead.propertyInterest}</td>
                  <td style={{ fontWeight:600 }}>PKR {formatBudget(lead.budget)}</td>
                  <td><ScoreBadge score={lead.score} /></td>
                  <td>
                    <select value={lead.status} onChange={e => quickStatus(lead._id, e.target.value)} className="filter-select" style={{ padding:'4px 6px', fontSize:12 }}>
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>
                    <select value={lead.assignedTo?._id||''} onChange={e => quickAssign(lead._id, e.target.value)} className="filter-select" style={{ padding:'4px 6px', fontSize:12 }}>
                      <option value="">Unassigned</option>
                      {agents.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                    </select>
                  </td>
                  <td>
                    <div style={{ display:'flex', gap:4 }}>
                      <button onClick={() => openEdit(lead)} className="btn btn-ghost btn-sm">Edit</button>
                      <button onClick={() => handleDelete(lead._id)} className="btn btn-danger btn-sm">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">{editId ? 'Edit Lead' : 'Create New Lead'}</div>
            {formErr && <div className="alert-error">{formErr}</div>}
            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div className="form-group"><label className="form-label">Name *</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="form-input" /></div>
                <div className="form-group"><label className="form-label">Email *</label><input type="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="form-input" /></div>
                <div className="form-group"><label className="form-label">Phone *</label><input required value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} className="form-input" placeholder="923001234567" /></div>
                <div className="form-group"><label className="form-label">Budget (PKR) *</label><input type="number" required min={0} value={form.budget} onChange={e=>setForm({...form,budget:e.target.value})} className="form-input" /></div>
              </div>
              <div className="form-group"><label className="form-label">Property Interest *</label><input required value={form.propertyInterest} onChange={e=>setForm({...form,propertyInterest:e.target.value})} className="form-input" placeholder="e.g. 3-bed apartment in DHA Phase 6" /></div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
                <div className="form-group"><label className="form-label">Assign to Agent</label>
                  <select value={form.assignedTo} onChange={e=>setForm({...form,assignedTo:e.target.value})} className="form-select">
                    <option value="">Unassigned</option>
                    {agents.map(a=><option key={a._id} value={a._id}>{a.name}</option>)}
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Follow-up Date</label><input type="date" value={form.followUpDate} onChange={e=>setForm({...form,followUpDate:e.target.value})} className="form-input" /></div>
              </div>
              <div className="form-group"><label className="form-label">Notes</label><textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} className="form-textarea" /></div>
              <div style={{ display:'flex', gap:8, justifyContent:'flex-end', marginTop:4 }}>
                <button type="button" onClick={closeModal} className="btn btn-ghost">Cancel</button>
                <button type="submit" disabled={saving} className="btn btn-black">{saving ? 'Saving...' : editId ? 'Update Lead' : 'Create Lead'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
