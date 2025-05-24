"use client"

import React from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

const categories = [
  {
    title: "Mental Health Support",
    links: [
      {
        name: "Beyond Blue - Mental Health Support for Cancer Patients",
        url: "https://www.beyondblue.org.au",
        description: "Resources for managing anxiety, depression, and emotional well-being."
      },
      {
        name: "Cancer Council Victoria - Support and Information",
        url: "https://www.cancervic.org.au",
        description: "Pain management, emotional well-being, and social connection resources."
      }
    ]
  },
  {
    title: "Physical Health & Activities",
    links: [
      {
        name: "Cancer Council Australia - Living Well After Cancer",
        url: "https://www.cancer.org.au/living-well-after-cancer",
        description: "Tips on physical activity, energy, and symptom management."
      },
      {
        name: "Physiotherapy & Exercise Programs",
        url: "https://www.physiotherapy.asn.au",
        description: "Directory to find certified cancer physiotherapists."
      }
    ]
  },
  {
    title: "Diet & Nutrition",
    links: [
      {
        name: "Healthy Eating After Cancer - Cancer Council",
        url: "https://www.cancercouncil.com.au/healthy-eating",
        description: "Evidence-based nutrition tips for cancer survivors."
      },
      {
        name: "Find a Dietitian",
        url: "https://dietitiansaustralia.org.au",
        description: "Search for oncology-specialized dietitians."
      }
    ]
  },
  {
    title: "Meditation & Spirituality",
    links: [
      {
        name: "Smiling Mind Meditation App",
        url: "https://www.smilingmind.com.au",
        description: "Free guided meditations and mindfulness resources."
      },
      {
        name: "Spiritual Care Australia",
        url: "https://www.spiritualcareaustralia.org.au",
        description: "Support for spiritual wellbeing during survivorship."
      }
    ]
  },
  {
    title: "Read. Reflect. Rise",
    links: [
      {
        name: "Radical Remission by Kelly A. Turner",
        url: "https://www.amazon.com/Radical-Remission-Kelly-Turner-PhD/dp/0062268740",
        description: "A book exploring healing stories beyond conventional treatments."
      },
      {
        name: "Anti-Cancer: A New Way of Life by Dr. David Servan-Schreiber",
        url: "https://www.amazon.com/Anticancer-New-Life-David-Servan-Schreiber/dp/0670021644",
        description: "Evidence-backed lifestyle changes to support recovery."
      }
    ]
  }
]

export default function ResourcesTab() {
  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <Card key={category.title} className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-forest-green">{category.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {category.links.map((link) => (
              <div key={link.url} className="border-b pb-3">
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-dusty-blue hover:underline">
                  <ExternalLink className="h-4 w-4" />
                  {link.name}
                </a>
                <p className="text-sm text-gray-600 ml-6">{link.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
