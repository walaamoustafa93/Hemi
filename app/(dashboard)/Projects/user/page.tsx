import { Suspense } from "react";
import Loading from "@/app/loading";
import { Users } from "lucide-react";
import UserTable from "../../../../components/Data-Tables/UserTable";

// GetAllUsers
// export async function getAllUsers(): Promise<User[]> {
//   const cookies = await getCookies();

//   const sessionCookie = cookies.get("connect.sid");
//   if (!sessionCookie) {
//     throw new Error("Session cookie not found");
//   }

//   const response = await fetch(
//     `${process.env.NEXT_PUBLIC_API_BASE_URL}/users`,
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
//     throw new Error("Failed to fetch Users");
//   }

//   const usersData = await response.json();

//   return usersData;
// }

export default async function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min mt-5 p-10">
          <div className="flex flex-row gap-4 text-custom-green2 mb-3">
            <div>
              <Users />
            </div>
            <div className="text-xl font-bold  gap-2">Users </div>
          </div>
          <UserTable />
        </div>
      </div>
    </Suspense>
  );
}
