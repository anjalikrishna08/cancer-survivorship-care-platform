from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
from datetime import datetime
from typing import Optional
import re
from care_plan_templates import carePlanText, carePlanTagMap, formatCarePlanToHTML

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML model
model = joblib.load("model.pkl")

class SurveyFeatures(BaseModel):
    gender: str
    diet: str
    sleepQuality: str
    smokingStatus: str
    alcoholUse: str
    riskStratification: str
    cardiovascularRisk: bool
    fertilityConcern: bool
    copingStyle: str
    ptsdFlag: bool
    cognitiveFunctionScore: str
    careCoordinationScore: int
    lifestyleChangeEffort: str
    fearOfRecurrenceScore: int
    noSignificantIssues: bool
    stress: bool
    symptoms: list
    emotionalSymptoms: list
    recoveryGoals: list
    dateOfBirth: str
    firstName: str
    userId: str
    activityLevel: Optional[str] = None
    emotionalDistress: Optional[str] = None
    sleepDisruptionScore: Optional[int] = 0
    skinChanges: Optional[int] = 0
    respiratoryIssues: Optional[int] = 0

@app.post("/predict")
async def predict(request: Request):
    try:
        data = await request.json()
        features = SurveyFeatures(**data)

        feature_map = {
            "gender": {"male": 0, "female": 1, "non-binary": 2, "prefer-not-to-say": 3},
            "diet": {"balanced": 0, "mostly-healthy": 1, "needs-improvement": 2, "poor": 3},
            "sleepQuality": {"excellent": 0, "good": 1, "fair": 2, "poor": 3},
            "smokingStatus": {"never": 0, "former": 1, "current": 2},
            "alcoholUse": {"never": 0, "occasionally": 1, "regularly": 2},
            "riskStratification": {"low": 0, "medium": 1, "high": 2},
            "copingStyle": {"adaptive": 0, "avoidant": 1, "unsure": 2},
            "cognitiveFunctionScore": {"excellent": 0, "good": 1, "fair": 2, "poor": 3},
            "lifestyleChangeEffort": {"very-willing": 0, "somewhat-willing": 1, "not-willing": 2},
        }

        input_data = [
            feature_map["gender"].get(features.gender, 0),
            feature_map["diet"].get(features.diet, 0),
            feature_map["sleepQuality"].get(features.sleepQuality, 0),
            feature_map["smokingStatus"].get(features.smokingStatus, 0),
            feature_map["alcoholUse"].get(features.alcoholUse, 0),
            feature_map["riskStratification"].get(features.riskStratification, 0),
            int(features.cardiovascularRisk),
            int(features.fertilityConcern),
            feature_map["copingStyle"].get(features.copingStyle, 0),
            int(features.ptsdFlag),
            feature_map["cognitiveFunctionScore"].get(features.cognitiveFunctionScore, 0),
            features.careCoordinationScore,
            feature_map["lifestyleChangeEffort"].get(features.lifestyleChangeEffort, 0),
            features.fearOfRecurrenceScore,
            int(features.noSignificantIssues),
            int(features.stress),
            len(features.symptoms),
            len(features.emotionalSymptoms),
            len(features.recoveryGoals)
        ]

        while len(input_data) < 33:
            input_data.append(0)

        prediction = model.predict(np.array(input_data).reshape(1, -1))
        tag = int(prediction[0])
        label = carePlanTagMap.get(tag, "General")

        raw_text = carePlanText[label].replace("{name}", features.firstName)
        formatted_html = formatCarePlanToHTML(raw_text)

        return {
            "carePlanTag": tag,
            "carePlanText": formatted_html
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
