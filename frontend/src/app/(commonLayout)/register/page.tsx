import RegisterForm from "@/components/module/Auth/RegisterForm";

export default function RegisterPage() {
  return (
    <section className="flex min-h-[70vh] items-center justify-center bg-[#f5f8f5] px-5 py-14">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-[0_18px_60px_-40px_rgba(15,23,42,0.3)] sm:p-9">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-800">Start building</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">Make your work visible.</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">Create your student account and bring your projects together.</p>
        <div className="mt-7"><RegisterForm /></div>
      </div>
    </section>
  );
}
