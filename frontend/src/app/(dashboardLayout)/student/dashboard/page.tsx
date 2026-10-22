
import StudentProjects from "@/components/module/Projects/StudentProjects";
import { getMyProjects } from "@/services/project/project.api";

export default async function StudentDashboardPage() {
  const result = await getMyProjects();
  return <StudentProjects projects={result.projects} error={result.error} />;
}
