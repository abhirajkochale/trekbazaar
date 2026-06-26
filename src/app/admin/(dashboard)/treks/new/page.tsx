import { TrekForm } from "../TrekForm";

export const dynamic = "force-dynamic";

export default function NewTrekPage() {
  return (
    <div>
      <h1 className="mb-5 text-xl font-semibold text-zinc-900">Add New Trek</h1>
      <div className="rounded border border-zinc-200 bg-white p-5">
        <TrekForm />
      </div>
    </div>
  );
}
