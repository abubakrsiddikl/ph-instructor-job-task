import Link from "next/link";
import { ArrowUpRight, Layers3 } from "lucide-react";

export default function Navbar() {
	return (
		<header className="border-b border-slate-200/80 bg-white/90">
			<nav aria-label="Main navigation" className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-3 sm:px-8">
				<Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight text-slate-950">
					<span className="flex size-9 items-center justify-center rounded-md bg-emerald-700 text-white"><Layers3 size={19} aria-hidden="true" /></span>
					<span>Projectfolio<span className="text-emerald-700">.</span></span>
				</Link>
				<div className="order-3 flex w-full items-center justify-center gap-6 text-sm text-slate-600 sm:order-none sm:w-auto">
					<Link className="transition-colors hover:text-slate-950" href="/#features">Features</Link>
					<Link className="transition-colors hover:text-slate-950" href="/#how-it-works">How it works</Link>
				</div>
				<div className="flex items-center gap-2">
					<Link href="/login" className="inline-flex h-8 items-center justify-center rounded-md px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100">Log in</Link>
					<Link href="/register" className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md bg-emerald-700 px-3 text-sm font-medium text-white transition-colors hover:bg-emerald-800">Join free <ArrowUpRight size={15} aria-hidden="true" /></Link>
				</div>
			</nav>
		</header>
	);
}
