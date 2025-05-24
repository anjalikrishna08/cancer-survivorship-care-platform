export async function predictCarePlanTag(surveyData: any): Promise<number> {
    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(surveyData)
      })
  
      if (!response.ok) {
        throw new Error("Prediction failed")
      }
  
      const data = await response.json()
      return data.carePlanTag
    } catch (error) {
      console.error("❌ Prediction error:", error)
      throw error
    }
  }
  