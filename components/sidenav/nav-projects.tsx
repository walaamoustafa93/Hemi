/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import Link from 'next/link';
import { Columns3 } from 'lucide-react';
import { Projects } from '@/types';
import ViewActionsDropdown from '../CRUD/Views/ViewActionsDropdown';
import { Dashboard } from '@/types';
import AddViews from '../CRUD/Views/AddViews';
// import { useRouter } from 'next/navigation';

export function NavProjects({
  projects,
  projectId,
}: {
  projects: Projects[];
  projectId: number | null;
}) {
  const [views, setViews] = useState<Dashboard[]>([]);
  // const router = useRouter();

  // useEffect(() => {
  //   if (projectId) {
  //     const fetchViews = async () => {
  //       try {
  //         const response = await fetch(
  //           `https://localhost:7219/api/projects/${projectId}/dashboards`
  //         );
  //         if (!response.ok) {
  //           console.error('Failed to fetch views');
  //           return;
  //         }
  //         const data: Dashboard[] = await response.json();
  //         setViews(data);
  //         router.refresh();
  //       } catch (err) {
  //         console.error('Error fetching views:', err);
  //       }
  //     };

  //     fetchViews();
  //   }
  // }, [projectId]);
  useEffect(() => {
    if (projectId) {
      const getProjects = async () => {
        try {
          const data = await fetch(
            `https://localhost:7219/api/projects/${projectId}/dashboards`
          );
          const result = await data.json();
          setViews(result);
        } catch (error) {
          console.error('Error fetching projects:', error);
        } finally {
          // setLoading(false);
        }
      };

      getProjects();
    }
  }, []);

  const currentProject = projects.find((project) => project.id === projectId);
  console.log({ views });
  return (
    <div>
      <SidebarGroup className="group-data-[collapsible=icon]:hidden">
        <AddViews projectId={projectId} />
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/Projects/${projectId}`}>
                <SidebarGroupLabel className="font-bold text-md">
                  Views <Columns3 className="ml-auto" />
                </SidebarGroupLabel>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Go to Projects Page</p>
            </TooltipContent>
          </Tooltip>

          <SidebarMenu>
            {currentProject ? (
              views.length > 0 ? (
                views.map((view) => (
                  <SidebarMenuItem key={view.id}>
                    <span className="text-md font-semibold cursor-pointer">
                      <SidebarMenuAction showOnHover>
                        <ViewActionsDropdown
                          views={view}
                          projectId={projectId}
                        />
                        <span className="sr-only">More</span>
                      </SidebarMenuAction>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link
                            href={`/Projects/${projectId}/views/${view.id}`}
                          >
                            <SidebarMenuButton className="hover:bg-custom-green2">
                              {view.name}
                            </SidebarMenuButton>
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View {view.name} Details</p>
                        </TooltipContent>
                      </Tooltip>
                    </span>
                  </SidebarMenuItem>
                ))
              ) : (
                <SidebarMenuItem className="pl-3">
                  No views available{' '}
                </SidebarMenuItem>
              )
            ) : (
              <SidebarMenuItem>No project selected</SidebarMenuItem>
            )}
          </SidebarMenu>
        </TooltipProvider>
      </SidebarGroup>
    </div>
  );
}
