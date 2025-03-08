import { Suspense } from "react";
import Loading from "@/app/loading";
import { Share2 } from "lucide-react";
import DevicesTable from "../../../../../../components/Data-Tables/DevicesTable";
import { dataPolling, dataType } from "@/lib/ConnectionsData";


// export async function getDevices(): Promise<Devices[]> {
//   const cookies = await getCookies();

//   const sessionCookie = cookies.get("connect.sid");

//   if (!sessionCookie) {
//     throw new Error("Session cookie not found");
//   }

//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_API_BASE_URL}/devices`,
//     {
//       headers: {
//         "Content-Type": "application/json",
//         Cookie: `connect.sid=${sessionCookie}`,
//       },
//     }
//   );

//   if (!response.ok && response.status === 401) {
//     throw new Error("Not authenticated");
//   }

//   if (!response.ok) {
//     throw new Error("Failed to fetch devices");
//   }

//   const devices = await response.json();

//   return devices;
// }

export default async function Page({
  params,
}: {
  params: Promise<{ ProjectId: string; projectName: string }>
}) {
  const ProjectId = (await params).ProjectId
  const projectName = (await params).projectName
  const decodedProjectName = decodeURIComponent(projectName);

  // const devices = await getDevices();

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min mt-5 p-10">
          <div className="flex flex-row gap-4 text-custom-green2 mb-3">
            <Share2 />
            <div className="text-xl font-bold">
              Connections for: {decodedProjectName}
            </div>
          </div>

          <DevicesTable
          // devices={devices}
            ProjectId={ProjectId}
            selectType={dataType}
            selectPolling={dataPolling}
          />
        </div>
      </div>
    </Suspense>
  );
}
