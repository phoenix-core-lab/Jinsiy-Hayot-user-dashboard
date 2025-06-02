import Header from "@/components/layout/Header/Header";
import { NewsSidebar } from "@/components/layout/NewsSidebar/NewsSidebar";
import Sidebar from "@/components/layout/Sidebar/Sidebar";
import MobileDrawer from "@/components/MobileDrawer/MobileDrawer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <Header />
      <MobileDrawer />
      <div className="flex flex-col h-[calc(100vh-83px)] lg:flex-row">
        <Sidebar />
        <main className="flex-1">
          <div className="twinkling"></div>
          <div className="stars"></div>
          {children}
        </main>
        <NewsSidebar />
      </div>
    </div>
  );
}
