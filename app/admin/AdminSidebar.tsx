import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
  {
    title: "Overview",
    url: "/admin",
    icon: Settings,
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: Inbox,
  },
  {
    title: "Create New Products",
    url: "/admin/products/new",
    icon: Calendar,
  },
  // {
  //   title: "Edit Products",
  //   url: "/admin/products/edit",
  //   icon: Calendar,
  // },
  {
    title: "Orders",
    url: "/admin/orders",
    icon: Settings,
  },
  // {
  //   title: "Search",
  //   url: "#",
  //   icon: Search,
  // },
  // {
  //   title: "Settings",
  //   url: "#",
  //   icon: Settings,
  // },
];

const AdminSidebar = () => {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarContent>
        <SidebarGroup></SidebarGroup>
      </SidebarContent>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenuItem>
              <SidebarMenuButton>p</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
