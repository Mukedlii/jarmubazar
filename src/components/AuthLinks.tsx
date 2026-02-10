"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { isSupabaseConfigured, supabase } from "@/lib/supabaseClient";

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-white"
    >
      {children}
    </Link>
  );
}

export default function AuthLinks() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let alive = true;

    async function load() {
      if (!isSupabaseConfigured) return;
      const { data } = await supabase.auth.getSession();
      if (!alive) return;
      setAuthed(Boolean(data.session));
    }

    load();

    if (!isSupabaseConfigured) return;
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!alive) return;
      setAuthed(Boolean(session));
    });

    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  if (!isSupabaseConfigured) {
    return <NavLink href="/login">Bejelentkezés</NavLink>;
  }

  if (!authed) {
    return <NavLink href="/login">Bejelentkezés</NavLink>;
  }

  return (
    <>
      <NavLink href="/offers">Ajánlatok</NavLink>
      <button
        onClick={() => supabase.auth.signOut()}
        className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-900 dark:hover:text-white"
      >
        Kijelentkezés
      </button>
    </>
  );
}
