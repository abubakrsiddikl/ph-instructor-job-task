import MentorProjects from "@/components/module/Projects/MentorProjects";
import {
  getMentorProjects,
  getProjectStatistics,
} from "@/services/project/project.api";
import { projectQuerySchema } from "@/zodSchema/project.schema";

export default async function MentorDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; limit?: string; status?: string }>;
}) {
  const params = await searchParams;
  const parsed = projectQuerySchema.safeParse(params);
  const query = parsed.success ? parsed.data : projectQuerySchema.parse({});
  const [list, statistics] = await Promise.all([
    getMentorProjects(query),
    getProjectStatistics(),
  ]);
  console.log("list", list);
  console.log("statics", statistics);

  return (
    <MentorProjects list={list} statistics={statistics} filter={query.status} />
  );
}
