import Link from "next/link";
import { Layers3 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold text-white">
          <Layers3 size={18} aria-hidden="true" /> Projectfolio
        </Link>
        <p className="text-sm text-slate-400">A home for the work you are proud of.</p>
        <p className="text-xs text-slate-500">© 2026 Projectfolio</p>
      </div>
    </footer>
  );
}