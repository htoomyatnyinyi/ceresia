import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import AdminSidebar from "./AdminSidebar";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const cookieStore = await cookies();
  // const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider>
      {/* <SidebarProvider defaultOpen={defaultOpen}> */}
      <AdminSidebar />

      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default Layout;
