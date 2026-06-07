export default function Health() {
  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900">Business Health</h1>
        <p className="text-stone-600 mt-2">Assessment history and domain analysis</p>
      </div>

      <div className="bg-stone-50 rounded-2xl border border-stone-100 p-12 text-center">
        <p className="text-stone-600">No assessments yet. Take your first assessment to see your business health score.</p>
        <button className="mt-4 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold">
          Take Assessment
        </button>
      </div>
    </div>
  );
}
