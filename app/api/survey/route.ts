import { PrismaClient } from '@prisma/client'
import { NextRequest } from 'next/server'
import { formatCarePlanToHTML } from '@/lib/format-care-plan'
import { carePlanTagMap, carePlanText } from "@/lib/full-care-plan-templates"

const prisma = new PrismaClient()

async function predictCarePlanTag(surveyData: any): Promise<number> {
  try {
    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(surveyData)
    })

    if (!response.ok) throw new Error("Prediction request failed")
    const result = await response.json()
    return result.carePlanTag
  } catch (error) {
    console.error("❌ Error calling prediction API:", error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    console.log("📥 Received survey submission:", data)

    if (!data.userId || !data.email) {
      throw new Error("Missing required userId or email.")
    }

    const predictedTag = await predictCarePlanTag(data)

    const newSurvey = await prisma.survey.create({
      data: {
        userId: data.userId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        gender: data.gender,
        dateOfBirth: new Date(data.dateOfBirth),
        typeOfCancer: data.typeOfCancer,
        dateOfDiagnosis: new Date(data.dateOfDiagnosis),
        dateTreatmentEnded: new Date(data.dateTreatmentEnded),
        treatmentsReceived: data.treatmentsReceived,
        otherTreatments: data.otherTreatments,
        physicalHealth: data.physicalHealth ?? "",
        symptoms: data.symptoms ?? [],
        physicalActivity: data.physicalActivity ?? "",
        physicalConcerns: data.physicalConcerns ?? "",
        emotionalWellbeing: data.emotionalWellbeing ?? "",
        emotionalSymptoms: data.emotionalSymptoms ?? [],
        supportSystem: data.supportSystem ?? "",
        emotionalConcerns: data.emotionalConcerns ?? [],
        diet: data.diet,
        sleepQuality: data.sleepQuality,
        recoveryGoals: data.recoveryGoals ?? [],
        additionalInfo: data.additionalInfo ?? "",
        smokingStatus: data.smokingStatus,
        alcoholUse: data.alcoholUse,
        riskStratification: data.riskStratification,
        cardiovascularRisk: data.cardiovascularRisk,
        fertilityConcern: data.fertilityConcern,
        copingStyle: data.copingStyle,
        ptsdFlag: data.ptsdFlag,
        cognitiveFunctionScore: data.cognitiveFunctionScore,
        careCoordinationScore: data.careCoordinationScore,
        lifestyleChangeEffort: data.lifestyleChangeEffort,
        fearOfRecurrenceScore: data.fearOfRecurrenceScore,
        noSignificantIssues: data.noSignificantIssues,
        stress: data.stress,
        lateEffectSymptoms: data.lateEffectSymptoms ?? "",
        predictedTag: predictedTag
      }
    })

    const tagLabel = carePlanTagMap[predictedTag] || "General"
    const planText = carePlanText[tagLabel] || "Your care plan is under development."
    const personalizedText = planText.replace("{name}", data.firstName || "Survivor")

    // ✅ Ensure formatted HTML uses constrained width for production
    const formattedHTML = formatCarePlanToHTML(personalizedText.replace(
      '<div class="care-plan-content prose max-w-none text-gray-800">',
      '<div class="prose max-w-prose text-gray-800">'
    ))

    const carePlan = await prisma.carePlan.create({
      data: {
        title: `Care Plan - ${tagLabel}`,
        description: formattedHTML,
        rawText: personalizedText,
        status: "draft",
        userId: data.userId,
      }
    })

    return Response.json({
      success: true,
      carePlan: {
        title: carePlan.title,
        description: carePlan.description,
        tag: predictedTag
      },
      surveyId: newSurvey.id
    }, { status: 201 })

  } catch (error) {
    console.error("❌ Error saving survey or predicting care tag:", error)
    return new Response(JSON.stringify({
      success: false,
      error: 'Survey creation or prediction failed',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : '',
    }), { status: 500 })
  }
}
