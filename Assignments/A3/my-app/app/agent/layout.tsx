import Navbar from '@/components/Navbar';
export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar role="agent" />
      <div className="page-wrap">
        <div className="page-content">{children}</div>
      </div>
    </>
  );
}
