"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { updateProjectStatus } from "@/services/project/project.api";
import type { Project, ProjectListResult, ProjectStatistics, ProjectStatusFilter } from "@/types/project.type";

const filters: { label: string; value: ProjectStatusFilter }[] = [
  { label: "All projects", value: "ALL" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

function statusStyle(status: Project["status"]) {
  if (status === "APPROVED") return "bg-emerald-50 text-emerald-800";
  if (status === "REJECTED") return "bg-rose-50 text-rose-800";
  return "bg-amber-50 text-amber-800";
}

export default function MentorProjects({
  list,
  statistics,
  filter,
}: {
  list: ProjectListResult;
  statistics: ProjectStatistics | null;
  filter: ProjectStatusFilter;
}) {
  const [busyProject, setBusyProject] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const setQuery = (next: { page?: number; status?: ProjectStatusFilter }) => {
    const params = new URLSearchParams();
    params.set("page", String(next.page ?? 1));
    const nextFilter = next.status ?? filter;
    if (nextFilter !== "ALL") params.set("status", nextFilter);
    startTransition(() => router.push(`/mentor/dashboard/projects?${params.toString()}`));
  };

  const review = (project: Project, status: "APPROVED" | "REJECTED") => {
    setBusyProject(project.id);
    startTransition(async () => {
      const result = await updateProjectStatus(project.id, status);
      setBusyProject(null);
      if (!result.success) {
        toast.error(result.message ?? "Could not update this project.");
        return;
      }
      toast.success(result.message);
      router.refresh();
    });
  };

  const stats = [
    { label: "Total projects", value: statistics?.total ?? 0, tone: "text-foreground" },
    { label: "Awaiting review", value: statistics?.totalPending ?? 0, tone: "text-amber-700" },
    { label: "Approved", value: statistics?.totalApproved ?? 0, tone: "text-emerald-700" },
    { label: "Rejected", value: statistics?.totalRejected ?? 0, tone: "text-rose-700" },
  ];

  return (
    <section className="mx-auto max-w-7xl space-y-7">
      <header className="border-b pb-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Mentor workspace</p>
        <h1 className="text-2xl font-semibold tracking-tight">Project review</h1>
        <p className="mt-1 text-sm text-muted-foreground">Review student submissions and record a decision.</p>
      </header>

      <div className="grid grid-cols-2 divide-x divide-y border sm:grid-cols-4 sm:divide-y-0">
        {stats.map((stat) => (
          <div key={stat.label} className="px-4 py-3 sm:px-5">
            <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
            <p className={`mt-1 text-2xl font-semibold tabular-nums ${stat.tone}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {list.error && <p role="status" className="border-l-2 border-amber-500 pl-3 text-sm text-amber-800">Could not load projects: {list.error}</p>}

      <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
        <div className="flex items-center gap-1" aria-label="Filter projects">
          {filters.map((item) => (
            <Button key={item.value} type="button" size="sm" variant={filter === item.value ? "secondary" : "ghost"} aria-pressed={filter === item.value} disabled={isPending} onClick={() => setQuery({ status: item.value })}>{item.label}</Button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">{list.total} {list.total === 1 ? "submission" : "submissions"}</p>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project</TableHead>
            <TableHead>Student</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Review</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {list.projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="min-w-56 whitespace-normal">
                <p className="font-medium">{project.name}</p>
                <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{project.description}</p>
                <a href={project.repositoryUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-800 underline underline-offset-2">Repository <ExternalLink className="size-3" /></a>
                {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="ml-3 inline-flex items-center gap-1 text-xs text-emerald-800 underline underline-offset-2">Live site <ExternalLink className="size-3" /></a>}
              </TableCell>
              <TableCell className="min-w-36 whitespace-normal">{project.student?.name ?? "Student"}<span className="mt-1 block text-xs text-muted-foreground">{project.student?.email}</span></TableCell>
              <TableCell>{new Date(project.createdAt).toLocaleDateString()}</TableCell>
              <TableCell><span className={`inline-flex rounded-sm px-2 py-1 text-xs font-medium ${statusStyle(project.status)}`}>{project.status}</span></TableCell>
              <TableCell>
                <div className="flex justify-end gap-1">
                  {project.status === "PENDING" ? <>
                    <Button type="button" size="sm" variant="outline" aria-label={`Approve ${project.name}`} title="Approve" disabled={isPending} onClick={() => review(project, "APPROVED")}><Check className="size-4 text-emerald-700" /> Approve</Button>
                    <Button type="button" size="sm" variant="outline" aria-label={`Reject ${project.name}`} title="Reject" disabled={isPending} onClick={() => review(project, "REJECTED")}><X className="size-4 text-rose-700" /> Reject</Button>
                  </> : <span className="px-2 text-xs text-muted-foreground">Reviewed</span>}
                  {busyProject === project.id && <span className="sr-only">Updating project</span>}
                </div>
              </TableCell>
            </TableRow>
          ))}
          {list.projects.length === 0 && <TableRow><TableCell colSpan={5} className="h-28 text-center text-muted-foreground">No projects match this filter.</TableCell></TableRow>}
        </TableBody>
      </Table>

      <footer className="flex items-center justify-between border-t pt-4 text-sm">
        <p className="text-muted-foreground">Page {list.page} of {Math.max(1, list.totalPage)}</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" aria-label="Previous page" disabled={isPending || list.page <= 1} onClick={() => setQuery({ page: list.page - 1 })}><ChevronLeft className="size-4" /> Previous</Button>
          <Button variant="outline" size="sm" aria-label="Next page" disabled={isPending || list.page >= list.totalPage} onClick={() => setQuery({ page: list.page + 1 })}>Next <ChevronRight className="size-4" /></Button>
        </div>
      </footer>
    </section>
  );
}