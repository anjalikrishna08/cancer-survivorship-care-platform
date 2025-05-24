// app/api/chat/route.ts
import { NextRequest } from "next/server"
import OpenAI from "openai"

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
  const { message } = await req.json()

  if (!message || typeof message !== "string") {
    return new Response(JSON.stringify({ error: "Missing or invalid message" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a compassionate and knowledgeable cancer survivorship assistant. Respond to users with empathy, clarity, and practical advice related to physical, emotional, mental, and lifestyle challenges after cancer treatment. Avoid giving medical diagnoses or treatment prescriptions.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    })

    const reply = completion.choices[0].message.content

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("❌ OpenAI API error:", error)
    return new Response(JSON.stringify({ error: "OpenAI request failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
