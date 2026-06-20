import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { subject, topics, examDate } = await request.json();

    if (!subject || !topics || !examDate) {
      return NextResponse.json(
        { error: "Subject, topics, and exam date are required." },
        { status: 400 }
      );
    }

   const today = new Date().toISOString().split("T")[0];

const prompt = `Today's date is ${today}. Create a detailed day-by-day study plan for the subject "${subject}", covering these topics: ${topics}. The exam is on ${examDate}. Use the actual dates starting from today (${today}) for each day in the plan — do NOT use any other year or assume a different date. Break the plan into days, list which topics to cover each day, and keep it realistic and well-paced. Return the plan in clear, simple text with day-wise headings.`;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Groq API error:", errorData);
      return NextResponse.json(
        { error: "Failed to generate study plan." },
        { status: 500 }
      );
    }

    const data = await response.json();
    const plan = data.choices?.[0]?.message?.content ?? "No plan generated.";

    // Save the generated plan into Supabase
    const { error: dbError } = await supabase.from("plans").insert({
      subject,
      topics,
      exam_date: examDate,
      plan,
    });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      // Still return the plan even if saving fails
      return NextResponse.json({
        plan,
        warning: "Plan generated but failed to save.",
      });
    }

    return NextResponse.json({ plan });
  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}