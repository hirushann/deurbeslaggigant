export default function Loading() {
  return (
    <div className="container-page animate-pulse pt-8" aria-busy="true" aria-label="Laden">
      <div className="h-4 w-64 rounded-full bg-stone" />
      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="aspect-square rounded-2xl bg-surface" />
        <div className="space-y-4">
          <div className="h-3 w-24 rounded-full bg-stone" />
          <div className="h-10 w-4/5 rounded-xl bg-stone" />
          <div className="mt-8 h-64 rounded-2xl bg-surface" />
        </div>
      </div>
    </div>
  );
}
