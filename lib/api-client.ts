// lib/api-client.ts

export async function getCurrentUser() {
    try {
      const res = await fetch("/api/me", { credentials: "include" })
      if (!res.ok) return null
      return await res.json()
    } catch {
      return null
    }
  }
  
  export async function isAdmin() {
    const user = await getCurrentUser()
    return user?.userType === "admin"
  }
  export async function predictCarePlanTag(surveyData: any) {
    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(surveyData),
    })
  
    if (!response.ok) {
      throw new Error("Prediction failed")
    }
  
    const data = await response.json()
    return data.carePlanTag
  }
  