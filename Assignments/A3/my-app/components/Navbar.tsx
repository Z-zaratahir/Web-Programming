'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

interface NavbarProps { role: 'admin' | 'agent'; }

const adminLinks = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/leads', label: 'Leads' },
  { href: '/admin/followups', label: 'Follow-ups' },
];
const agentLinks = [
  { href: '/agent/dashboard', label: 'Dashboard' },
  { href: '/agent/leads', label: 'My Leads' },
  { href: '/agent/followups', label: 'Follow-ups' },
];

interface Notification {
  _id: string; title: string; message: string; read: boolean;
  createdAt: string; leadId?: string;
}

export default function Navbar({ role }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const links = role === 'admin' ? adminLinks : agentLinks;
  const [userName, setUserName] = useState('');
  const [unread, setUnread] = useState(0);
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const fetchNotifs = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const d = await res.json();
        setNotifs(d.notifications || []);
        setUnread(d.unreadCount || 0);
      }
    } catch { /* noop */ }
  }, []);

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => { if (d.user) setUserName(d.user.name); });
    fetchNotifs();
    const id = setInterval(fetchNotifs, 5000);
    return () => clearInterval(id);
  }, [fetchNotifs]);

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setShowUserMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = async () => {
    await fetch('/api/notifications', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ markAllRead: true }) });
    fetchNotifs();
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  return (
    <nav className="topnav">
      {/* Brand */}
      <Link href={role === 'admin' ? '/admin/dashboard' : '/agent/dashboard'} className="topnav-brand">
        <span>Prop</span>CRM
      </Link>

      {/* Nav Links */}
      <div className="topnav-links">
        {links.map(l => (
          <Link key={l.href} href={l.href} className={`topnav-link${pathname === l.href ? ' active' : ''}`}>
            {l.label}
          </Link>
        ))}
      </div>

      {/* Right side */}
      <div className="topnav-right">
        {/* Notification bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifs(v => !v)}
            className="icon-btn relative"
            style={{ width: 36, height: 36 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            {unread > 0 && (
              <span style={{ position: 'absolute', top: 4, right: 4, minWidth: 16, height: 16, borderRadius: '50%', background: '#EF4444', color: '#fff', fontSize: 10, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="notif-panel" style={{ zIndex: 999 }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: 13 }}>Notifications</span>
                {unread > 0 && <button onClick={markAllRead} style={{ fontSize: 12, color: 'var(--accent)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>Mark all read</button>}
              </div>
              <div style={{ overflowY: 'auto', maxHeight: 360 }}>
                {notifs.length === 0 ? (
                  <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--gray-400)', fontSize: 13 }}>No notifications</div>
                ) : notifs.slice(0, 12).map(n => (
                  <div key={n._id}
                    className={`notif-item${!n.read ? ' notif-unread' : ''}`}
                    onClick={() => { if (n.leadId) { router.push(`/${role}/leads/${n.leadId}`); setShowNotifs(false); } }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      {!n.read && <div className="notif-dot" />}
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{n.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>{n.message}</div>
                        <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 4 }}>{new Date(n.createdAt).toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User avatar / menu */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setShowUserMenu(v => !v)}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 10px', borderRadius: 8, border: '1px solid var(--gray-200)', background: 'var(--white)', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
            <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--accent)', color: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800 }}>
              {userName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <span style={{ maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userName || 'User'}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
          </button>

          {showUserMenu && (
            <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 6px)', background: 'var(--white)', border: '1px solid var(--gray-200)', borderRadius: 10, overflow: 'hidden', minWidth: 160, boxShadow: '0 6px 24px rgba(0,0,0,0.1)', zIndex: 999, animation: 'fadeUp 0.15s ease' }}>
              <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--gray-100)' }}>
                <div style={{ fontSize: 12, color: 'var(--gray-400)', textTransform: 'capitalize' }}>{role}</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{userName}</div>
              </div>
              <button onClick={handleLogout} style={{ width: '100%', padding: '10px 14px', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, color: '#DC2626', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
