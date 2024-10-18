import { ProtectedLayout } from "@/components/dashboard/protected-layout";
import DashboardLayout from "@/components/dashboard/sidebar";
import { Header } from "@/components/header";


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout>
      <Header/>
      <DashboardLayout>
    

        <main className="flex-1 bg-white p-6 overflow-x-hidden overflow-y-auto">
        
          {children}
        </main>

      </DashboardLayout>
    </ProtectedLayout>
  );
}
