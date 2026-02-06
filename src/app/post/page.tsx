export default function PostPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="mx-auto max-w-3xl px-5 py-10">
        <h1 className="text-2xl font-bold">Hirdetés feladás (MVP)</h1>
        <p className="mt-2 text-slate-600">
          Itt lesz a hirdetés feladó űrlap. Beküldés után a hirdetés státusza: <b>pending</b>.
          Publikálás csak admin jóváhagyással.
        </p>
      </div>
    </main>
  );
}
