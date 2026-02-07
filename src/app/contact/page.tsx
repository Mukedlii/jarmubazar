import { APP } from "@/lib/config";

function obfuscateEmail(email: string) {
  const [u, d] = email.split("@");
  if (!u || !d) return email;
  return `${u} [kukac] ${d}`;
}

export default function ContactPage() {
  const shown = obfuscateEmail(APP.adminEmail);

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Kapcsolat</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-400">
        Az e-mail címünket direktben nem tesszük ki minden oldal láblécébe (spam miatt).
      </p>

      <div className="mt-6 rounded-2xl border bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/30">
        <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">E-mail</div>
        <div className="mt-2 font-mono text-sm text-slate-900 dark:text-slate-100">{shown}</div>
        <div className="mt-3 text-xs text-slate-500 dark:text-slate-500">
          Tipp: másold át a "[kukac]" részt @-ra.
        </div>
      </div>
    </div>
  );
}
