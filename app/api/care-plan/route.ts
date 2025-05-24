import { PrismaClient } from "@prisma/client"
import { NextRequest } from "next/server"

const prisma = new PrismaClient()

// ✅ Convert plain care plan text into structured, styled HTML
function formatCarePlanToHTML(text: string): string {
  let lines = text.split("\n")
  let html = '<div class="care-plan-content prose max-w-none text-gray-800">'
  let inList = false

  for (let line of lines) {
    if (line.startsWith("Title: ")) {
      html += `<h2 class="text-xl font-semibold mb-4">${line.replace("Title: ", "")}</h2>`
    } else if (line.startsWith("Dear ")) {
      html += `<p class="mb-4">${line}</p>`
    } else if (line.startsWith("● ")) {
      if (!inList) {
        html += '<ul class="list-disc ml-6 mb-4">'
        inList = true
      }
      html += `<li>${line.replace("● ", "")}</li>` // ✅ NOT bold
    } else if (line.startsWith("○ ") || line.startsWith("o ")) {
      if (!inList) {
        html += '<ul class="list-disc ml-6 mb-4">'
        inList = true
      }
      html += `<li>${line.replace(/^○ |^o /, "")}</li>` // ✅ Sub-bullets
    } else if (/^[A-Z][A-Za-z\s]+:$/.test(line.trim())) {
      if (inList) {
        html += "</ul>"
        inList = false
      }
      html += `<h3 class="text-lg font-bold mt-6 mb-2">${line.replace(":", "")}</h3>` // ✅ Section headings bold
    } else if (line.trim() === "") {
      if (inList) {
        html += "</ul>"
        inList = false
      }
      html += `<div class="my-2"></div>` // cleaner than <br />
    } else {
      html += `<p>${line}</p>`
    }
  }

  if (inList) html += "</ul>"
  html += "</div>"
  return html
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId")

  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing userId" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  try {
    const carePlan = await prisma.carePlan.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })

    if (!carePlan) {
      return new Response(JSON.stringify({ error: "No care plan found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    const formattedHTML = formatCarePlanToHTML(carePlan.description)

    return new Response(
      JSON.stringify({
        title: carePlan.title,
        description: formattedHTML,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Server error", details: String(error) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}
