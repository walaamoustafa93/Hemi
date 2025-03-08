import { Suspense } from 'react';
import Loading from '@/app/loading';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import AddProjectButton from '@/components/motion/AddProject';
import Link from 'next/link';
import ProjectActionsDropdown from '@/components/CRUD/projects/ProjectActionsDropdown';

async function getProjects() {
  const res = await fetch(`https://localhost:7219/api/projects`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

export default async function PageProject() {
  const projects = await getProjects();
  console.log({ projects });
  return (
    // <ProtectedRoute>

    <Suspense fallback={<Loading />}>
      <div className="flex flex-row m-3 ">
        <div>
          <h1 className="mr-2 font-bold text-xl">Projects</h1>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        {projects && Array.isArray(projects) && projects.length > 0 ? (
          <div className="grid auto-rows-min gap-4 md:grid-cols-3 p-3">
            {projects.map((project) => (
              <div key={project.id}>
                <Card className="relative rounded-xl border-custom-green shadow-lg">
                  <CardHeader className="relative">
                    <CardTitle className="ml-1">{project.name}</CardTitle>
                    <div className="absolute top-0 right-0 p-2 mr-3">
                      <ProjectActionsDropdown projects={project} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="ml-1">
                      Description: {project.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter>
                    <AddProjectButton className="flex items-center justify-center w-full gap-2 text-base p-3">
                      <Link
                        href={`/Projects/${project.id}`}
                        className="flex items-center justify-center w-full"
                      >
                        View {project.name} Details
                      </Link>
                    </AddProjectButton>
                  </CardFooter>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <h1 className="flex items-center justify-center h-4/5 text-center text-gray-500">
            No Projects Available
          </h1>
        )}
      </div>
    </Suspense>
    // {/* </ProtectedRoute> */}
  );
}
