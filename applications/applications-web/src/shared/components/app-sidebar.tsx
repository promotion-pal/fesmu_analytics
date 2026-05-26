import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/shared/ui/sidebar";
import {
  TerminalSquareIcon,
  BotIcon,
  BookOpenIcon,
  TerminalIcon,
  ChevronRightIcon,
} from "lucide-react";
import { NavUser } from "@/shared/components/nav-user";
import { appConfig } from "../config/app";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/ui/collapsible";
import { TooltipProvider } from "../ui/tooltip";
import { ROUTE } from "../config/path";

const data = {
  user: {
    name: "Ростислав",
    email: "rostislav@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  menuStudent: [
    {
      title: "Заявки",
      icon: <TerminalSquareIcon />,
      list: [
        {
          title: "История",
          url: ROUTE.STUDENT.APPLICATION.LIST,
        },
        {
          title: "Создать",
          url: ROUTE.STUDENT.APPLICATION.CREATE,
        },
      ],
    },
    {
      url: "#",
      title: "Общежитие",
      icon: <BotIcon />,
    },
    {
      url: "#",
      title: "Документация",
      icon: <BookOpenIcon />,
    },
  ],
  menu: [
    {
      title: "Заявки",
      icon: <TerminalSquareIcon />,
      list: [
        {
          title: "История",
          url: ROUTE.STUDENT.APPLICATION.LIST,
        },
        {
          title: "Создать",
          url: ROUTE.STUDENT.APPLICATION.CREATE,
        },
      ],
    },
    {
      url: "#",
      title: "Общежитие",
      icon: <BotIcon />,
    },
    {
      url: "#",
      title: "Документация",
      icon: <BookOpenIcon />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <TooltipProvider>
      <Sidebar
        className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
        {...props}
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <a href="#">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <TerminalIcon className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {appConfig.name}
                    </span>
                    <span className="truncate text-xs">Студент</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <NavMenu items={data.menuStudent} />
        </SidebarContent>

        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>
    </TooltipProvider>
  );
}

interface MenuItem {
  url?: string;
  title: string;
  icon: React.ReactNode;
  list?: {
    title: string;
    url: string;
  }[];
}
function NavMenu({ items }: { items: MenuItem[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Платформа</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasSubmenu = item.list && item.list.length > 0;

          if (hasSubmenu) {
            return (
              <Collapsible
                key={item.title}
                asChild
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon}
                      <span>{item.title}</span>
                      <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.list?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }

          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <a href={item.url}>
                  {item.icon}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
