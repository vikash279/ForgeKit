import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col gap-3 py-20 text-center">
      <h1 className="text-2xl font-semibold">Tool not found</h1>
      <p className="text-sm text-muted-foreground">
        That utility is not in the registry. Head back to the catalog or search with Ctrl/Cmd+K.
      </p>
      <Link href="/" className="text-sm text-primary hover:underline">
        Return home
      </Link>
    </div>
  );
}
