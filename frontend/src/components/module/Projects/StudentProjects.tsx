"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Code2, ExternalLink, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { submitProject } from "@/services/project/project.api";
import type { Project, ProjectActionState } from "@/types/project.type";

const cooldownKey = "project-submit-cooldown";
const cooldownMs = 30_000;

function statusClass(status: Project["status"]) {
  if (status === "APPROVED") return "bg-emerald-50 text-emerald-800";
  if (status === "REJECTED") return "bg-rose-50 text-rose-800";
  return "bg-amber-50 text-amber-800";
}

export default function StudentProjects({
  projects,
  error,
}: {
  projects: Project[];
  error?: string;
}) {
  const [state, formAction, pending] = useActionState<ProjectActionState | null, FormData>(submitProject, null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [remainingCooldown, setRemainingCooldown] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const updateCooldown = () => {
      const until = Number(window.localStorage.getItem(cooldownKey) ?? 0);
      setRemainingCooldown(Math.max(0, Math.ceil((until - Date.now()) / 1000)));
    };
    updateCooldown();
    const timer = window.setInterval(updateCooldown, 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      window.localStorage.setItem(cooldownKey, String(Date.now() + cooldownMs));
      toast.success(state.message);
      router.refresh();
    } else if (state.message) {
      toast.error(state.message);
    }
  }, [router, state]);

  const getError = (field: string) => state?.errors?.find((item) => item.field === field)?.message;
  const repositoryExists = (formData: FormData) => {
    const repositoryUrl = String(formData.get("repositoryUrl") ?? "").trim().replace(/\/$/, "").toLowerCase();
    return projects.some((project) => project.repositoryUrl.replace(/\/$/, "").toLowerCase() === repositoryUrl);
  };

  return (
    <section className="mx-auto max-w-6xl space-y-7">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b pb-5">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Student workspace</p>
          <h1 className="text-2xl font-semibold tracking-tight">My projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">Submit work for mentor review and track every decision.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus aria-hidden="true" /> Add project
        </Button>
      </header>

      <div className="grid grid-cols-3 divide-x border-y py-4">
        {(["PENDING", "APPROVED", "REJECTED"] as const).map((status) => (
          <div className="px-4 first:pl-0" key={status}>
            <p className="text-xs font-medium text-muted-foreground">{status[0] + status.slice(1).toLowerCase()}</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{projects.filter((project) => project.status === status).length}</p>
          </div>
        ))}
      </div>

      {error && <p role="status" className="border-l-2 border-amber-500 pl-3 text-sm text-amber-800">Could not load projects: {error}</p>}

      <div className="space-y-3">
        <div>
          <h2 className="text-base font-semibold">Submission history</h2>
          <p className="text-sm text-muted-foreground">{projects.length} {projects.length === 1 ? "project" : "projects"}</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Links</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="min-w-56 whitespace-normal">
                  <p className="font-medium">{project.name}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{project.description}</p>
                </TableCell>
                <TableCell>{new Date(project.createdAt).toLocaleDateString()}</TableCell>
                <TableCell><span className={`inline-flex rounded-sm px-2 py-1 text-xs font-medium ${statusClass(project.status)}`}>{project.status}</span></TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <a aria-label="Repository" title="Repository" className="rounded p-2 text-muted-foreground hover:bg-muted hover:text-foreground" href={project.repositoryUrl} target="_blank" rel="noreferrer"><Code2 className="size-4" /></a>
                    {project.liveUrl && <a aria-label="Live project" title="Live project" className="rounded p-2 text-muted-foreground hover:bg-muted hover:text-foreground" href={project.liveUrl} target="_blank" rel="noreferrer"><ExternalLink className="size-4" /></a>}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {projects.length === 0 && <TableRow><TableCell colSpan={4} className="h-28 text-center text-muted-foreground">No projects submitted yet.</TableCell></TableRow>}
          </TableBody>
        </Table>
      </div>

      {isModalOpen && !state?.success && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-black/45 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setIsModalOpen(false); }}>
          <section aria-labelledby="project-modal-title" aria-modal="true" role="dialog" className="my-auto w-full max-w-xl border bg-background shadow-xl">
            <header className="flex items-start justify-between border-b px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">New submission</p>
                <h2 id="project-modal-title" className="mt-1 text-lg font-semibold">Add a project</h2>
              </div>
              <Button variant="ghost" size="icon" aria-label="Close" onClick={() => setIsModalOpen(false)}><X /></Button>
            </header>
            <form action={(formData) => {
              if (remainingCooldown > 0) {
                toast.error(`Please wait ${remainingCooldown}s before another submission.`);
                return;
              }
              if (repositoryExists(formData)) {
                toast.error("This repository is already in your submissions.");
                return;
              }
              formAction(formData);
            }} className="space-y-4 px-6 py-5">
              <label className="block space-y-1.5 text-sm font-medium" htmlFor="project-name">Project name
                <Input id="project-name" name="name" placeholder="e.g. Campus events platform" required aria-invalid={!!getError("name")} />
                {getError("name") && <span className="block text-xs font-normal text-destructive">{getError("name")}</span>}
              </label>
              <label className="block space-y-1.5 text-sm font-medium" htmlFor="repository-url">Repository URL
                <Input id="repository-url" name="repositoryUrl" type="url" placeholder="https://github.com/you/project" required aria-invalid={!!getError("repositoryUrl")} />
                {getError("repositoryUrl") && <span className="block text-xs font-normal text-destructive">{getError("repositoryUrl")}</span>}
              </label>
              <label className="block space-y-1.5 text-sm font-medium" htmlFor="live-url">Live link <span className="font-normal text-muted-foreground">(optional)</span>
                <Input id="live-url" name="liveUrl" type="url" placeholder="https://your-project.com" aria-invalid={!!getError("liveUrl")} />
                {getError("liveUrl") && <span className="block text-xs font-normal text-destructive">{getError("liveUrl")}</span>}
              </label>
              <label className="block space-y-1.5 text-sm font-medium" htmlFor="project-description">Description
                <textarea id="project-description" name="description" placeholder="What does it do, and what did you build?" rows={4} required aria-invalid={!!getError("description")} className="flex min-h-24 w-full resize-y rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive" />
                {getError("description") && <span className="block text-xs font-normal text-destructive">{getError("description")}</span>}
              </label>
              <footer className="flex justify-end gap-2 border-t pt-4">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={pending || remainingCooldown > 0}>{pending ? "Submitting..." : remainingCooldown > 0 ? `Wait ${remainingCooldown}s` : "Submit project"}</Button>
              </footer>
            </form>
          </section>
        </div>
      )}
    </section>
  );
}