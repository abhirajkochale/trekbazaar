export default async function TrekDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 text-center font-sans">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
        Trek: {slug}
      </h1>
      <p className="mt-3 text-zinc-600">
        Trek details and the enquiry form will appear here.
      </p>
    </main>
  );
}
