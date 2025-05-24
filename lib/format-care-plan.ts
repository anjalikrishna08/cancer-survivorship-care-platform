export function formatCarePlanToHTML(text: string): string {
  const lines = text.split('\n')
  let html = '<div class="prose max-w-prose text-gray-800">'
  let inList = false

  for (const line of lines) {
    const trimmed = line.trim()

    if (trimmed.startsWith('## ')) {
      if (inList) {
        html += '</ul>'
        inList = false
      }
      html += `<h2 class="text-xl font-bold mt-6 mb-3">${trimmed.substring(3)}</h2>`
    } else if (trimmed.startsWith('### ')) {
      if (inList) {
        html += '</ul>'
        inList = false
      }
      html += `<h3 class="text-lg font-semibold mt-4 mb-2">${trimmed.substring(4)}</h3>`
    } else if (trimmed.startsWith('- ')) {
      if (!inList) {
        html += '<ul class="list-disc ml-6 space-y-1">'
        inList = true
      }
      html += `<li>${trimmed.substring(2)}</li>`
    } else if (trimmed === '') {
      if (inList) {
        html += '</ul>'
        inList = false
      }
      html += '<br>'
    } else {
      if (inList) {
        html += '</ul>'
        inList = false
      }

      // Replace **bold** syntax
      const withBold = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      html += `<p>${withBold}</p>`
    }
  }

  if (inList) html += '</ul>'
  html += '</div>'
  return html
}
