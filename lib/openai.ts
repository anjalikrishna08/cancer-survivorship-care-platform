// lib/openai.ts
export async function getOpenAIResponse(prompt: string): Promise<string> {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: prompt }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || "Failed to get response")
  }

  return data.reply
}

 