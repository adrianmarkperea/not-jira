export default function ProtectedPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Protected</h1>
      <p className="text-foreground/60">You are signed in.</p>
    </div>
  );
}
