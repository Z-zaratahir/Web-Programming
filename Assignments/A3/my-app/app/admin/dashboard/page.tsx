'use client';
import { useState, useEffect, useCallback } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';

const STATUS_COLORS = ['#3B82F6','#8B5CF6','#10B981','#F59E0B','#EC4899','#047857','#DC2626'];
const PRIORITY_COLORS: Record<string,string> = { High:'#EF4444', Medium:'#F59E0B', Low:'#3B82F6' };

interface Analytics {
  totalLeads: number; overdueFollowUps: number; staleLeads: number; unassignedLeads: number;
  statusDistribution: {_id:string;count:number}[];
  priorityDistribution: {_id:string;count:number}[];
  agentPerformance: {agentName:string;totalAssigned:number;closedWon:number;closedLost:number;inProgress:number;conversionRate:number}[];
  leadsOverTime: {_id:string;count:number}[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) setData(await res.json());
    } catch { /**/ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetch_(); const id = setInterval(fetch_, 10000); return () => clearInterval(id); }, [fetch_]);

  if (loading) return <div style={{ display:'flex', justifyContent:'center', padding:'80px 0' }}><div className="spinner" /></div>;
  if (!data) return <div style={{ textAlign:'center', padding:'80px 0', color:'var(--gray-400)' }}>Failed to load analytics</div>;

  const stats = [
    { label: 'Total Leads', value: data.totalLeads, accent: true },
    { label: 'Unassigned', value: data.unassignedLeads },
    { label: 'Overdue Follow-ups', value: data.overdueFollowUps },
    { label: 'Stale Leads', value: data.staleLeads },
  ];
  const statusData = data.statusDistribution.map(s => ({ name: s._id, value: s.count }));
  const priorityData = data.priorityDistribution.map(p => ({ name: p._id, value: p.count }));
  const timeData = data.leadsOverTime.map(l => ({ date: l._id.slice(5), count: l.count }));

  return (
    <div className="fade-up">
      <div className="page-header" style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
        <div>
          <h1 className="page-title">Analytics Dashboard</h1>
          <p className="page-subtitle">Real-time overview — refreshes every 10 seconds</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="stat-grid">
        {stats.map((s, i) => (
          <div key={i} className={`stat-card${s.accent ? ' stat-accent' : ''}`}>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value">{s.value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
        <div className="card">
          <div className="section-title">Status Distribution</div>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={2} dataKey="value" label={({ name, value }) => `${name} (${value})`} labelLine={false}>
                  {statusData.map((_,i) => <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <div style={{ height:260, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--gray-400)' }}>No data yet</div>}
        </div>

        <div className="card">
          <div className="section-title">Priority Distribution</div>
          {priorityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={priorityData} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" />
                <XAxis dataKey="name" tick={{ fontSize:12, fill:'var(--gray-500)' }} />
                <YAxis tick={{ fontSize:12, fill:'var(--gray-500)' }} />
                <Tooltip />
                <Bar dataKey="value" radius={[6,6,0,0]}>
                  {priorityData.map((e,i) => <Cell key={i} fill={PRIORITY_COLORS[e.name] || '#6B7280'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <div style={{ height:260, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--gray-400)' }}>No data yet</div>}
        </div>
      </div>

      {timeData.length > 0 && (
        <div className="card" style={{ marginBottom:16 }}>
          <div className="section-title">Leads Created — Last 30 Days</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" />
              <XAxis dataKey="date" tick={{ fontSize:11, fill:'var(--gray-500)' }} />
              <YAxis tick={{ fontSize:12, fill:'var(--gray-500)' }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="var(--accent)" strokeWidth={2} dot={{ fill:'var(--accent)', r:3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Agent performance */}
      <div className="card">
        <div className="section-title">Agent Performance</div>
        {data.agentPerformance.length > 0 ? (
          <div className="table-wrap" style={{ border:'none', marginTop:4 }}>
            <table>
              <thead>
                <tr>
                  <th>Agent</th>
                  <th>Assigned</th>
                  <th>Won</th>
                  <th>Lost</th>
                  <th>In Progress</th>
                  <th>Conversion</th>
                </tr>
              </thead>
              <tbody>
                {data.agentPerformance.map((a, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight:600 }}>{a.agentName}</td>
                    <td>{a.totalAssigned}</td>
                    <td style={{ color:'#059669', fontWeight:600 }}>{a.closedWon}</td>
                    <td style={{ color:'#DC2626', fontWeight:600 }}>{a.closedLost}</td>
                    <td>{a.inProgress}</td>
                    <td>
                      <span className={`badge ${a.conversionRate >= 50 ? 'badge-qualified' : 'badge-proposal'}`}>
                        {a.conversionRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p style={{ color:'var(--gray-400)', fontSize:13, padding:'16px 0' }}>No agents registered yet</p>}
      </div>
    </div>
  );
}
