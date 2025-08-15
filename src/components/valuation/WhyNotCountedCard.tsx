export function WhyNotCountedCard({ excluded }: { excluded: Array<{ source:string; url:string; reason:string }> }) {
  if (!excluded?.length) return null;
  return (
    <div className="rounded-2xl border p-4">
      <div className="font-semibold">Listings Not Counted (and why)</div>
      <ul className="mt-2 list-disc pl-5 text-sm">
        {excluded.map((e, i) => (
          <li key={i}>
            <span className="font-medium">{e.source}</span> — {e.reason} <a className="underline" href={e.url} target="_blank">view</a>
          </li>
        ))}
      </ul>
    </div>
  );
}