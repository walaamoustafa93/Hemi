/* eslint-disable @typescript-eslint/no-unused-vars */
import { DashboardWrapper } from '@/components/dashboard/dashboard-wrapper';
import { Dashboard } from '@/types';

async function getDashboardsById(
  ProjectId: number,
  dashboardId: number
): Promise<Dashboard> {
  const res = await fetch(
    `https://localhost:7219/api/projects/${ProjectId}/dashboards/${dashboardId}`,
    {
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }

  return res.json();
}

interface EditScreenPageProps {
  params: {
    ProjectId: number; // تأكد من أنه يتوافق مع نوع الـ ID المستخدم في API
    dashboardId: number;
  };
}
const EditScreenPage = async ({ params }: EditScreenPageProps) => {
  const { ProjectId, dashboardId } = params;
  const project = await getDashboardsById(ProjectId, dashboardId);

  return (
    <div>
      <DashboardWrapper ProjectId={ProjectId} />
    </div>
  );
};

export default EditScreenPage;

// async function getProjectById(id: number): Promise<Projects> {
//   const res = await fetch(`https://localhost:7219/api/projects/${id}/dashboards/${}`, {
//     cache: 'no-store',
//   });
//   if (!res.ok) {
//     throw new Error('Failed to fetch data');
//   }

//   return res.json();
// }
// const EditScreenPage = ({
//   params: { ProjectId, dashboardId },
// }: {
//   params: { ProjectId: number; dashboardId: string }; // ✅ تغيير number إلى string
// }) => {
//   return (
//     <div>
//       <DashboardWrapper ProjectId={ProjectId} />
//     </div>
//   );
// };
// export default EditScreenPage;
// const EditScreenPage = ({
//   params: { ProjectId, editId },
// }: {
//   params: { ProjectId: number; editId: number };
// }) => {
//   return (
//     <div>
//       <DashboardWrapper ProjectId={ProjectId} />
//     </div>
//   );
// };

// export default EditScreenPage;
