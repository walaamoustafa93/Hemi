import React, { Suspense } from "react";
import MultiStepCampaign from "@/app/multi-step-form/(campaign)/_components/multi-step-campaign";
import Loading from "@/app/loading";

  export default async function Settings({
    params,
  }: {
    params: Promise<{ ProjectId: string; projectName: string }>
  }) {
    const ProjectId = (await params).ProjectId
    const projectName = (await params).projectName
  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-col">
        <div>
         
        </div>
        <div className="flex justify-center items-center min-h-96 pb-5">
          <MultiStepCampaign projectName={projectName} ProjectId={ProjectId} />
        </div>
      </div>
    </Suspense>
  );
}
