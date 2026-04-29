import Navbar from '@/components/Navbar';
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar role="admin" />
      <div className="page-wrap">
        <div className="page-content">{children}</div>
      </div>
    </>
  );
}
