import Loading from '@/app/loading';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import React, { Suspense } from 'react';
import Link from 'next/link';
import { Projects } from '@/types';
import ViewActionsDropdown from '@/components/CRUD/Views/ViewActionsDropdown';

import {
  Eye,
  Pencil,
  Settings,
  Share2,
  List,
  MoreHorizontal,
} from 'lucide-react';
// import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import ViewButton from '@/components/motion/ViewButton';

async function getProjectById(id: number): Promise<Projects> {
  const res = await fetch(`https://localhost:7219/api/projects/${id}`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ ProjectId: number }>;
}) {
  const ProjectId = (await params).ProjectId;
  const project = await getProjectById(ProjectId);
  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-col gap-6 m-6">
        {project ? (
          <>
            <Card className=" shadow-lg">
              <CardHeader className="relative">
                <CardTitle>{project.name}</CardTitle>
                <div className="absolute top-2 right-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="mr-3" asChild>
                      <span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className=" mr-3" asChild>
                              <MoreHorizontal />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Configration</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <Link
                        href={`/Projects/${ProjectId}/assignUser/${project.name}`}
                      >
                        <DropdownMenuItem className="flex justify-between items-center text-blue-500">
                          <span>Assign users</span>
                          <List />
                        </DropdownMenuItem>
                      </Link>
                      <Link
                        href={`/Projects/${ProjectId}/connections/${project.name}`}
                      >
                        <DropdownMenuItem className="flex justify-between items-center text-green-500">
                          <span>Connections</span>
                          <Share2 />
                        </DropdownMenuItem>
                      </Link>

                      <DropdownMenuSeparator />
                      <Link
                        href={`/Projects/${ProjectId}/settings/${project.name}`}
                      >
                        <DropdownMenuItem className="flex justify-between items-center text-gray-600">
                          <span>Setting</span>
                          <Settings />
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  <p>
                    <strong>Description:</strong>{' '}
                    {project.description || 'No description available'}
                  </p>
                  <p>
                    <strong>Created At:</strong>{' '}
                    {new Date(project.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Updated At:</strong>{' '}
                    {new Date(project.updatedAt).toLocaleString()}
                  </p>
                </CardDescription>
              </CardContent>
            </Card>

            {/* Views Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg">Views for {project.name}</h2>
              </div>
              <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                {project.dashboards && project.dashboards.length > 0 ? (
                  project.dashboards.map((view) => (
                    <Card key={view.id} className="border shadow-md">
                      <CardHeader className="relative">
                        <CardTitle>{view.name}</CardTitle>
                        <div className="absolute top-0 right-0 p-2 mr-5">
                          <ViewActionsDropdown
                            projectId={ProjectId}
                            views={view}
                          />{' '}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>
                          <p>
                            <strong>Description:</strong>{' '}
                            {view.description || 'No description'}
                          </p>
                          <p>
                            <strong>Created At:</strong>{' '}
                            {new Date(view.createdAt).toLocaleString()}
                          </p>
                          <p>
                            <strong>Updated At:</strong>{' '}
                            {new Date(view.updatedAt).toLocaleString()}
                          </p>
                        </CardDescription>
                      </CardContent>
                      <CardFooter className="flex justify-between items-center space-x-3">
                        <Link
                          className="w-full"
                          href={`/Projects/${ProjectId}/dashboard/${view.id}?edit=true`}
                          passHref
                        >
                          <ViewButton className="flex items-center">
                            Edit <Pencil className="ml-3" size={18} />
                          </ViewButton>
                        </Link>

                        <Link
                          href={`/Projects/${ProjectId}/dashboard/${view.id}?edit=false`}
                          passHref
                          className="w-full"
                        >
                          <ViewButton className="flex items-center">
                            View <Eye size={18} className="ml-3" />
                          </ViewButton>
                        </Link>
                      </CardFooter>
                      {/* <CardFooter className="flex justify-between items-center space-x-3">
                        <Link
                          className="w-full"
                          href={`/Projects/${ProjectId}/edit/${view.id}`}
                          passHref
                        >
                          <ViewButton className="flex items-center">
                            Edit <Pencil className="ml-3" size={18} />
                          </ViewButton>
                        </Link>

                        <Link
                          href={`/Projects/${ProjectId}/views/${view.id}`}
                          passHref
                          className="w-full"
                        >
                          <ViewButton className="flex items-center">
                            View <Eye size={18} className="ml-3" />
                          </ViewButton>
                        </Link>
                      </CardFooter> */}
                    </Card>
                  ))
                ) : (
                  <p className="text-gray-500">
                    No views available for this project.
                  </p>
                )}
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-500">Failed to load project details.</p>
        )}
      </div>
    </Suspense>
  );
}
