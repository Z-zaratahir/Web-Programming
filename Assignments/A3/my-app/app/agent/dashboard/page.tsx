'use client';
import { useState, useEffect, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const STATUS_COLORS = ['#3B82F6','#8B5CF6','#10B981','#F59E0B','#EC4899','#047857','#DC2626'];

interface AgentStats {
  agentName: string;
  totalAssigned: number;
  closedWon: number;
  closedLost: number;
  inProgress: number;
  conversionRate: number;
  statusBreakdown: {_id:string; count:number}[];
}

export default function AgentDashboard() {
  const [stats, setStats] = useState<AgentStats|null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const [meRes, analyticsRes] = await Promise.all([fetch('/api/auth/me'), fetch('/api/analytics')]);
      if (meRes.ok && analyticsRes.ok) {
        const me = await meRes.json();
        const analytics = await analyticsRes.json();
        const mine = analytics.agentPerformance?.find(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (a: any) => a.agentId === me.user?.userId || a.agentName === me.user?.name
        );
        if (mine) setStats(mine);
      }
    } catch { /**/ } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchStats(); const id = setInterval(fetchStats, 10000); return () => clearInterval(id); }, [fetchStats]);

  if (loading) return <div style={{ display:'flex', justifyContent:'center', padding:'80px 0' }}><div className="spinner" /></div>;

  if (!stats) return (
    <div className="fade-up">
      <div className="page-header">
        <h1 className="page-title">My Dashboard</h1>
        <p className="page-subtitle">Your performance overview</p>
      </div>
      <div className="card" style={{ textAlign:'center', padding:'60px 24px' }}>
        <p style={{ color:'var(--gray-400)', fontSize:14 }}>No leads assigned yet. Check back once an admin assigns leads to you.</p>
      </div>
    </div>
  );

  const statCards = [
    { label: 'Assigned Leads', value: stats.totalAssigned },
    { label: 'In Progress',    value: stats.inProgress },
    { label: 'Closed Won',     value: stats.closedWon,     accent: true },
    { label: 'Conversion Rate',value: `${stats.conversionRate}%` },
  ];

  const pieData = stats.statusBreakdown.map(s => ({ name: s._id, value: s.count }));

  return (
    <div className="fade-up">
      <div className="page-header">
        <h1 className="page-title">My Dashboard</h1>
        <p className="page-subtitle">Your personal performance — refreshes every 10 seconds</p>
      </div>

      <div className="stat-grid" style={{ marginBottom: 24 }}>
        {statCards.map((c, i) => (
          <div key={i} className={`stat-card${c.accent ? ' stat-accent' : ''}`}>
            <div className="stat-label">{c.label}</div>
            <div className="stat-value">{c.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <div className="card">
          <div className="section-title">My Leads by Status</div>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={2} dataKey="value" label={({ name, value }) => `${name} (${value})`} labelLine={false}>
                  {pieData.map((_,i) => <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : <div style={{ height:260, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--gray-400)' }}>No data yet</div>}
        </div>

        <div className="card">
          <div className="section-title">Performance Summary</div>
          <div style={{ display:'flex', flexDirection:'column', gap:12, marginTop:8 }}>
            {[
              { label:'Total Assigned', value: stats.totalAssigned, bar: 100 },
              { label:'In Progress',    value: stats.inProgress,    bar: stats.totalAssigned ? (stats.inProgress/stats.totalAssigned)*100 : 0 },
              { label:'Closed Won',     value: stats.closedWon,     bar: stats.totalAssigned ? (stats.closedWon/stats.totalAssigned)*100 : 0, color:'#10B981' },
              { label:'Closed Lost',    value: stats.closedLost,    bar: stats.totalAssigned ? (stats.closedLost/stats.totalAssigned)*100 : 0, color:'#EF4444' },
            ].map(item => (
              <div key={item.label}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:4 }}>
                  <span style={{ color:'var(--gray-500)', fontWeight:500 }}>{item.label}</span>
                  <span style={{ fontWeight:700 }}>{item.value}</span>
                </div>
                <div style={{ height:6, borderRadius:3, background:'var(--gray-100)', overflow:'hidden' }}>
                  <div style={{ height:'100%', borderRadius:3, width:`${Math.min(item.bar,100)}%`, background: item.color || 'var(--accent)', transition:'width 0.5s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
