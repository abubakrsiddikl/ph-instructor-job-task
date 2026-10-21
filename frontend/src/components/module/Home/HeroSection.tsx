import Link from "next/link";
import { ArrowRight, Check, CircleCheck, Code2, ExternalLink, Sparkles } from "lucide-react";

export default function HeroSection() {
	return (
		<section id="how-it-works" className="relative overflow-hidden bg-[#f5f8f5]">
			<div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 md:grid-cols-[0.92fr_1.08fr] md:gap-8 md:py-24">
				<div className="relative z-10 max-w-xl">
					<p className="mb-6 inline-flex items-center gap-2 border-l-2 border-emerald-600 pl-3 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800"><Sparkles size={15} /> Built for student makers</p>
					<h1 className="max-w-[12ch] text-5xl font-semibold leading-[1.04] tracking-tight text-slate-950 sm:text-6xl">Your work deserves <span className="text-emerald-700">a place.</span></h1>
					<p className="mt-6 max-w-lg text-base leading-7 text-slate-600">Bring your best projects together, share what you have built, and make your progress visible to the people who matter.</p>
					<div className="mt-8 flex flex-wrap gap-3">
						<Link href="/register" className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-emerald-700 px-5 text-sm font-medium text-white transition-colors hover:bg-emerald-800">Build your portfolio <ArrowRight size={17} /></Link>
						<Link href="#features" className="inline-flex h-11 items-center justify-center rounded-md border border-slate-300 bg-white px-5 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-50">Explore features</Link>
					</div>
					<div className="mt-7 flex items-center gap-2 text-sm text-slate-500"><CircleCheck size={16} className="text-emerald-700" /> Free for students. Always focused on your work.</div>
				</div>

				<div className="relative mx-auto w-full max-w-[600px] md:ml-auto">
					<div className="absolute -right-8 -top-8 size-40 rounded-full bg-lime-200/70 blur-3xl" />
					<div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_24px_80px_-36px_rgba(15,23,42,0.34)]">
						<div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
							<div><p className="text-xs font-medium uppercase tracking-wider text-slate-400">Student portfolio</p><p className="mt-1 font-semibold text-slate-900">Ayesha Rahman</p></div>
							<div className="flex size-10 items-center justify-center rounded-full bg-amber-100 text-sm font-semibold text-amber-900">AR</div>
						</div>
						<div className="grid gap-4 p-5 sm:grid-cols-[1.1fr_0.9fr] sm:p-6">
							<div className="relative flex min-h-48 flex-col justify-between overflow-hidden rounded-md bg-[#183c36] p-5 text-white">
								<div className="absolute -right-8 -top-10 size-40 rounded-full border-[24px] border-lime-300/20" />
								<span className="relative text-xs font-medium uppercase tracking-widest text-lime-200">Featured project</span>
								<div className="relative"><p className="text-xl font-semibold">Fieldnotes</p><p className="mt-1 text-sm text-emerald-100/80">A calmer way to plan your week.</p></div>
								<div className="relative flex items-center gap-3 text-xs text-emerald-100"><span className="inline-flex items-center gap-1"><Code2 size={13} /> React</span><span>TypeScript</span><span>2025</span></div>
							</div>
							<div className="flex flex-col justify-between rounded-md bg-[#edf3ee] p-5">
								<div><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Project status</p><span className="mt-3 inline-flex items-center gap-1.5 rounded-sm bg-white px-2.5 py-1.5 text-xs font-semibold text-emerald-800"><Check size={13} /> Approved</span></div>
								<div className="mt-6"><p className="text-3xl font-semibold text-slate-950">04</p><p className="mt-1 text-sm text-slate-600">projects shared</p><div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white"><div className="h-full w-3/4 rounded-full bg-emerald-700" /></div><p className="mt-2 text-xs text-slate-500">Portfolio completeness</p></div>
							</div>
						</div>
						<div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-xs text-slate-500"><span>Made with intention.</span><span className="inline-flex items-center gap-1 text-emerald-800">View project <ExternalLink size={12} /></span></div>
					</div>
					<div className="absolute -bottom-5 -left-5 hidden items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-lg sm:flex"><CircleCheck size={17} className="text-emerald-700" /> Ready to share</div>
				</div>
			</div>
		</section>
	);
}
