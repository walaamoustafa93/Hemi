import { Suspense } from "react";
import Loading from "@/app/loading";
import { Users } from "lucide-react";
import AssignUserTable from "../../../../../../components/Data-Tables/AssignUserTable";

// Fetch users on the server side


export default async function Page({
  params,
}: {
  params: Promise<{ ProjectId: string; projectName: string }>
}) {
  const ProjectId = (await params).ProjectId
  const projectName = (await params).projectName

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min mt-5 p-10">
          <div className="flex flex-row gap-4 text-custom-green2 mb-3">
            <div>
              <Users />
            </div>
            <div className="text-xl font-bold gap-2">
              Assign or invite Users for: {projectName}
            </div>
          </div>
        <AssignUserTable ProjectId={ProjectId} projectName={projectName} />
        </div>
      </div>
    </Suspense>
  );
}
