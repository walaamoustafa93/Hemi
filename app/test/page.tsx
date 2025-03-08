// import TestComponents from './testComponent';

interface Project {
  id: number;
  name: string;
  description: string;
}

const fetchProjects = async (): Promise<Project[]> => {
  try {
    const res = await fetch('https://localhost:7219/api/projects', {
      cache: 'no-store', // لجلب البيانات في كل طلب جديد
    });

    if (!res.ok) {
      throw new Error('Failed to fetch projects');
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};
const TestPage = async () => {
  const projects = await fetchProjects();
  console.log({ projects });
  return <div>{/* <TestComponents /> */}test</div>;
};

export default TestPage;
