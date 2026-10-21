import { ArrowUpRight, BadgeCheck, Blocks, GitBranch, type LucideIcon } from "lucide-react";

const features: { number: string; title: string; copy: string; icon: LucideIcon; accent: string }[] = [
	{ number: "01", title: "One clear portfolio", copy: "Collect your strongest work in one thoughtful, shareable profile that keeps the focus on what you made.", icon: Blocks, accent: "bg-emerald-100 text-emerald-800" },
	{ number: "02", title: "Show the real work", copy: "Add repository and live project links so reviewers can explore how your ideas came together.", icon: GitBranch, accent: "bg-amber-100 text-amber-900" },
	{ number: "03", title: "Feedback with purpose", copy: "See when a project has been reviewed and keep improving your portfolio as you learn.", icon: BadgeCheck, accent: "bg-sky-100 text-sky-900" },
];

export default function FeatureSection() {
	return (
		<section id="features" className="bg-white">
			<div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-20">
				<div className="flex flex-col justify-between gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-end">
					<div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">A better way to be seen</p><h2 className="mt-3 max-w-xl text-3xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-4xl">Turn learning into work you can share.</h2></div>
					<p className="max-w-sm text-sm leading-6 text-slate-600">From your first build to your next opportunity, keep your progress moving forward.</p>
				</div>
				<div className="grid gap-x-8 md:grid-cols-3">
					{features.map(({ number, title, copy, icon: Icon, accent }) => (
						<article key={number} className="border-b border-slate-200 py-7 md:border-b-0 md:py-9">
							<div className="flex items-center justify-between"><span className={`flex size-11 items-center justify-center rounded-md ${accent}`}><Icon size={20} aria-hidden="true" /></span><span className="text-sm font-medium text-slate-400">{number}</span></div>
							<h3 className="mt-6 text-lg font-semibold text-slate-950">{title}</h3>
							<p className="mt-2 max-w-sm text-sm leading-6 text-slate-600">{copy}</p>
							<div className="mt-5 flex items-center gap-2 text-xs font-medium text-slate-500">Made for your next step <ArrowUpRight size={14} /></div>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}
