'use client';

import * as React from 'react';
import { NavUser } from '@/components/sidenav/nav-user';
import { TeamSwitcher } from '@/components/sidenav/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Projects } from '@/types';
import { NavMain } from './nav-main';
import { NavProjects } from './nav-projects'; // Import NavProjects here
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// This is sample data.
const data = {
  user: {
    name: 'Neuss_HMI',
    des: 'Created By Neuss',
    avatar: '/3896504.png',
  },
  teams: [
    {
      name: 'Neuss HMI',
      logo: '',
      plan: 'Human-Machine Interface',
    },
  ],
};

export function AppSidebar({
  projects,
  ...props
}: { projects: Projects[] } & React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const segments = pathname.split('/'); // تقسيم المسار إلى أجزاء
  const projectId = segments[2];
  // // Check if the current path matches '/Projects/{projectId}' where projectId is a valid UUID
  // const isProjectDetailPage =
  //   /^\/Projects\/[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}$/.test(
  //     pathname
  //   );

  // // Extract projectId from the URL if it's a project detail page
  // const projectId = isProjectDetailPage ? pathname.split('/')[2] : null;
  // const projectIdNumber = projectId && parseInt(projectId);
  
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Link href="/Projects" passHref>
          <TeamSwitcher teams={data.teams} />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {/* Show NavMain in all paths except '/Projects/{projectId}' */}
        {!projectId && <NavMain projects={projects} />}

        {/* Show NavProjects only if the path matches '/Projects/{projectId}' */}
        {projectId && (
          <NavProjects projects={projects} projectId={parseInt(projectId)} />
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      <SidebarMenuButton
        size="lg"
        className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden"
      >
        <div className="grid flex-1 text-left text-sm leading-tight p-2 ">
          <span className=" text-xs text-custom-green">
            {' '}
            &#169; {data.user.des} 2025
          </span>
        </div>
      </SidebarMenuButton>
      <SidebarRail />
    </Sidebar>
  );
}
