"use client";

import { useState } from "react";

export default function Home() {
  const [subject, setSubject] = useState("");
  const [topics, setTopics] = useState("");
  const [examDate, setExamDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setPlan("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, topics, examDate }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setPlan(data.plan);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
            <main className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
              <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-2xl">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
                  PrepWise AI
                </h1>
              <p className="text-center text-gray-500 mb-4">
                   Apna personalized study plan banayein
              </p>

              <div className="text-center mb-6">
          
                  <a href="/plans" className="text-blue-600 hover:underline text-sm">
                      View Saved Plans
                  </a>
             </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Data Structures"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Topics
            </label>
            <textarea
              value={topics}
              onChange={(e) => setTopics(e.target.value)}
              placeholder="e.g. Arrays, Linked List, Trees"
              required
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exam Date
            </label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Study Plan"}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-red-600 text-sm text-center">{error}</p>
        )}

        {plan && (
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4 whitespace-pre-wrap text-sm text-gray-800">
            {plan}
          </div>
        )}
      </div>
    </main>
    );
  }