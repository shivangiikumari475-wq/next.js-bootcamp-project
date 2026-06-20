import { supabase } from "@/lib/supabase";

export default async function PlansPage() {
  const { data: plans, error } = await supabase
    .from("plans")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <p className="text-red-600">Failed to load plans.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Saved Study Plans
        </h1>

        {plans && plans.length === 0 && (
          <p className="text-center text-gray-500">No plans saved yet.</p>
        )}

        <div className="space-y-4">
          {plans?.map((p) => (
            <div
              key={p.id}
              className="bg-white shadow rounded-xl p-5 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="font-semibold text-lg text-gray-800">
                  {p.subject}
                </h2>
                <span className="text-sm text-gray-500">
                  Exam: {p.exam_date}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Topics: {p.topics}
              </p>
              <div className="whitespace-pre-wrap text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                {p.plan}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-blue-600 hover:underline text-sm">
            ← Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}