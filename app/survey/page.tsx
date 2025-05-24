"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { getAuthData } from "@/lib/token"

interface SurveyData {
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    dob: string
    gender: string
  }
  treatmentHistory: {
    cancerType: string
    diagnosisDate: string
    treatmentEndDate: string
    treatments: string[]
    otherTreatments: string
  }
  physicalHealth: {
    currentSymptoms: string[]
    otherSymptoms: string
    medications: string
    allergies: string
  }
  emotionalWellbeing: {
    mood: string
    supportSystem: string
    concerns: string[]
  }
  lifestyleGoals: {
    exercise: string
    diet: string
    sleep: string
    goals: string[]
    additionalInfo: string
  }
  lifestyleRisk: {
    smokingStatus: string
    alcoholUse: string
    riskStratification: string
    cardiovascularRisk: boolean
    fertilityConcern: boolean
    copingStyle: string
    ptsdFlag: boolean
    cognitiveFunctionScore: string
  }
  perceptions: {
    careCoordinationScore: number
    lifestyleChangeEffort: string
    fearOfRecurrenceScore: number
    noSignificantIssues: boolean
    stress: boolean
    lateEffectSymptoms: string
  }
}


export default function SurveyPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [userData, setUserData] = useState<{ firstName: string; lastName: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [surveyData, setSurveyData] = useState<SurveyData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      dob: '',
      gender: ''
    },
    treatmentHistory: {
      cancerType: '',
      diagnosisDate: '',
      treatmentEndDate: '',
      treatments: [],
      otherTreatments: ''
    },
    physicalHealth: {
      currentSymptoms: [],
      otherSymptoms: '',
      medications: '',
      allergies: ''
    },
    emotionalWellbeing: {
      mood: '',
      supportSystem: '',
      concerns: []
    },
    lifestyleGoals: {
      exercise: '',
      diet: '',
      sleep: '',
      goals: [],
      additionalInfo: ''
    },
    lifestyleRisk: {
      smokingStatus: '',
      alcoholUse: '',
      riskStratification: '',
      cardiovascularRisk: false,
      fertilityConcern: false,
      copingStyle: '',
      ptsdFlag: false,
      cognitiveFunctionScore: ''
    },
    perceptions: {
      careCoordinationScore: 3,
      lifestyleChangeEffort: '',
      fearOfRecurrenceScore: 5,
      noSignificantIssues: false,
      stress: false,
      lateEffectSymptoms: ''
    }
  })
  
  const totalSteps = 7

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authData = getAuthData()
        if (!authData) {
          router.push('/auth/login')
          return
        }

        // Split the name into first and last name
        const [firstName, ...lastNameParts] = authData.name.split(' ')
        const lastName = lastNameParts.join(' ')

        setUserData({
          firstName,
          lastName
        })

        // Set initial survey data with user info
        setSurveyData(prev => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            firstName,
            lastName,
            email: authData.email
          }
        }))
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router])

  const userId = getAuthData()?.id
  console.log(userId)
  const handleNext = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      window.scrollTo(0, 0)
    } else {
      try {
        const authData = getAuthData()
        const userId = authData?.id
  
        if (!userId) {
          throw new Error("User ID missing. Please log in again.")
        }
  
        const flatSurveyData = {
          ...flattenSurveyData(surveyData),
          userId
        }
  
        // 🔮 1. Predict care plan tag via FastAPI
        const predictionResponse = await fetch("http://localhost:8000/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(flatSurveyData)
        })
  
        const prediction = await predictionResponse.json()
  
        // 📦 2. Attach prediction to payload
        const payload = {
          ...flatSurveyData,
          carePlanTag: prediction.carePlanTag,
          carePlanText: prediction.carePlanText
        }
  
        // 💾 3. Send full payload to survey API (Next.js → Prisma)
        const response = await fetch("/api/survey", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        })
  
        if (!response.ok) {
          const errorResponse = await response.json()
          throw new Error(errorResponse.message || "Survey submission failed")
        }
  
        console.log("✅ Survey + care plan saved.")
        router.push("/dashboard")
  
      } catch (error) {
        console.error("❌ Submission failed:", error)
        alert("Submission failed: " + (error as Error).message)
      }
    }
  }
  
  

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const updateSurveyData = (step: number, data: any) => {
    setSurveyData(prev => {
      const newData = { ...prev }
      switch (step) {
        case 1:
          newData.personalInfo = { ...prev.personalInfo, ...data }
          break
        case 2:
          newData.treatmentHistory = { ...prev.treatmentHistory, ...data }
          break
        case 3:
          newData.physicalHealth = { ...prev.physicalHealth, ...data }
          break
        case 4:
          newData.emotionalWellbeing = { ...prev.emotionalWellbeing, ...data }
          break
        case 5:
          newData.lifestyleGoals = { ...prev.lifestyleGoals, ...data }
          break
        case 6:
            newData.lifestyleRisk = { ...prev.lifestyleRisk, ...data }
            break
        case 7:
            newData.perceptions = { ...prev.perceptions, ...data }
            break
          
      }
      return newData
    })
  }

  const isStepValid = (step: number, surveyData: SurveyData): boolean => {
    switch (step) {
      case 1:
        return (
          surveyData.personalInfo.firstName.trim() !== '' &&
          surveyData.personalInfo.lastName.trim() !== '' &&
          surveyData.personalInfo.email.trim() !== '' &&
          surveyData.personalInfo.dob.trim() !== '' &&
          surveyData.personalInfo.gender.trim() !== ''
        )
      case 2:
        return (
          surveyData.treatmentHistory.cancerType.trim() !== '' &&
          surveyData.treatmentHistory.diagnosisDate.trim() !== '' &&
          surveyData.treatmentHistory.treatmentEndDate.trim() !== ''
        )
      case 3:
      case 4:
      case 5:
        return true
      case 6:
        return (
          surveyData.lifestyleRisk.smokingStatus !== '' &&
          surveyData.lifestyleRisk.alcoholUse !== '' &&
          surveyData.lifestyleRisk.riskStratification !== '' &&
          surveyData.lifestyleRisk.copingStyle !== '' &&
          surveyData.lifestyleRisk.cognitiveFunctionScore !== ''
        )
      case 7:
        return (
          surveyData.perceptions.careCoordinationScore >= 1 &&
          surveyData.perceptions.careCoordinationScore <= 5 &&
          surveyData.perceptions.lifestyleChangeEffort !== '' &&
          surveyData.perceptions.fearOfRecurrenceScore >= 0 &&
          surveyData.perceptions.fearOfRecurrenceScore <= 10
        )
      default:
        return false
    }
  }
  

  if (loading) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-green mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your information...</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return null
  }

  return (
    <div className="min-h-screen bg-parchment py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-forest-green mb-4">Your Health Profile</h1>
          <p className="text-gray-600 mb-6">
            Help us create your personalized care plan by sharing information about your health journey.
          </p>

          <div className="mb-2 flex justify-between text-sm text-gray-500">
            <span>
              Step {currentStep} of {totalSteps}
            </span>
            <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
          </div>
          <Progress
            value={(currentStep / totalSteps) * 100}
            className="h-2 bg-gray-200 [&>div]:bg-dusty-blue"
          />
        </div>

        <Card className="border-none shadow-lg">
          <CardHeader className="bg-dusty-blue/10 rounded-t-lg">
            <CardTitle className="text-2xl text-forest-green">{getStepTitle(currentStep)}</CardTitle>
            <CardDescription>{getStepDescription(currentStep)}</CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            {renderStepContent(currentStep, userData, surveyData, updateSurveyData)}
          </CardContent>

          <CardFooter className="flex justify-between pt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="border-dusty-blue text-dusty-blue hover:bg-dusty-blue/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            <Button
              onClick={handleNext}
              className="bg-forest-green hover:bg-forest-green/90 text-white"
              disabled={!isStepValid(currentStep, surveyData)}
            >
              {currentStep === totalSteps ? "Complete Survey" : "Next"}
              {currentStep !== totalSteps && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}


function getStepTitle(step: number): string {
  switch (step) {
    case 1:
      return "Personal Information"
    case 2:
      return "Cancer Treatment History"
    case 3:
      return "Physical Health"
    case 4:
      return "Emotional Wellbeing"
    case 5:
      return "Lifestyle & Goals"
    case 6:
      return "Lifestyle Risk Factors"
    case 7:
      return "Care Perceptions & Long-Term Effects"
    default:
      return ""
  }
}


function getStepDescription(step: number): string {
  switch (step) {
    case 1:
      return "Basic information to help us personalize your care plan"
    case 2:
      return "Details about your cancer diagnosis and treatments"
    case 3:
      return "Your current physical health status and symptoms"
    case 4:
      return "Information about your emotional and mental wellbeing"
    case 5:
      return "Your lifestyle habits and recovery goals"
    case 6:
      return "Assess lifestyle risks and coping strategies"
    case 7:
      return "Perceptions of care, stress levels, and long-term recovery outlook"
    default:
      return ""
  }
}


function renderStepContent(step: number, userData: { firstName: string; lastName: string }, surveyData: SurveyData, updateSurveyData: (step: number, data: any) => void) {
  switch (step) {
    case 1:
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input 
                id="firstName" 
                value={userData.firstName} 
                disabled 
                className="bg-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input 
                id="lastName" 
                value={userData.lastName} 
                disabled 
                className="bg-gray-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              value={surveyData.personalInfo.email}
              onChange={(e) => updateSurveyData(1, { email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input 
              id="dob" 
              type="date" 
              value={surveyData.personalInfo.dob}
              onChange={(e) => updateSurveyData(1, { dob: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Gender</Label>
            <RadioGroup 
              value={surveyData.personalInfo.gender}
              onValueChange={(value) => updateSurveyData(1, { gender: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="non-binary" id="non-binary" />
                <Label htmlFor="non-binary">Non-binary</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="prefer-not-to-say" id="prefer-not-to-say" />
                <Label htmlFor="prefer-not-to-say">Prefer not to say</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      )

    case 2:
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="typeOfCancer" className="block text-sm font-medium text-gray-700">
              Type of Cancer
            </Label>
            <select
              id="typeOfCancer"
              name="typeOfCancer"
              required
              value={surveyData.treatmentHistory.cancerType}
              onChange={e => updateSurveyData(2, { cancerType: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-forest-green focus:outline-none focus:ring-1 focus:ring-forest-green text-gray-900"
            >
              <option value="">Select type</option>
              <option value="Breast">Breast</option>
              <option value="Lung">Lung</option>
              <option value="Skin">Skin</option>
              
         
              
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="diagnosisDate">Date of Diagnosis</Label>
            <Input 
              id="diagnosisDate" 
              type="date" 
              value={surveyData.treatmentHistory.diagnosisDate}
              onChange={(e) => updateSurveyData(2, { diagnosisDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="treatmentEndDate">Date Treatment Ended</Label>
            <Input 
              id="treatmentEndDate" 
              type="date" 
              value={surveyData.treatmentHistory.treatmentEndDate}
              onChange={(e) => updateSurveyData(2, { treatmentEndDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Treatments Received (Select all that apply)</Label>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <CheckboxItem 
                id="surgery" 
                label="Surgery"
                checked={surveyData.treatmentHistory.treatments.includes('surgery')}
                onCheckedChange={(checked) => {
                  const treatments = checked
                    ? [...surveyData.treatmentHistory.treatments, 'surgery']
                    : surveyData.treatmentHistory.treatments.filter(t => t !== 'surgery')
                  updateSurveyData(2, { treatments })
                }}
              />
              <CheckboxItem 
                id="chemotherapy" 
                label="Chemotherapy"
                checked={surveyData.treatmentHistory.treatments.includes('chemotherapy')}
                onCheckedChange={(checked) => {
                  const treatments = checked
                    ? [...surveyData.treatmentHistory.treatments, 'chemotherapy']
                    : surveyData.treatmentHistory.treatments.filter(t => t !== 'chemotherapy')
                  updateSurveyData(2, { treatments })
                }}
              />
              <CheckboxItem 
                id="radiation" 
                label="Radiation Therapy"
                checked={surveyData.treatmentHistory.treatments.includes('radiation')}
                onCheckedChange={(checked) => {
                  const treatments = checked
                    ? [...surveyData.treatmentHistory.treatments, 'radiation']
                    : surveyData.treatmentHistory.treatments.filter(t => t !== 'radiation')
                  updateSurveyData(2, { treatments })
                }}
              />
              <CheckboxItem 
                id="immunotherapy" 
                label="Immunotherapy"
                checked={surveyData.treatmentHistory.treatments.includes('immunotherapy')}
                onCheckedChange={(checked) => {
                  const treatments = checked
                    ? [...surveyData.treatmentHistory.treatments, 'immunotherapy']
                    : surveyData.treatmentHistory.treatments.filter(t => t !== 'immunotherapy')
                  updateSurveyData(2, { treatments })
                }}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="otherTreatments">Other Treatments</Label>
            <Textarea 
              id="otherTreatments" 
              value={surveyData.treatmentHistory.otherTreatments}
              onChange={(e) => updateSurveyData(2, { otherTreatments: e.target.value })}
              placeholder="Please describe any other treatments you received" 
            />
          </div>
        </div>
      )

    case 3:
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>How would you rate your overall physical health?</Label>
            <RadioGroup defaultValue="good">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excellent" id="excellent" />
                <Label htmlFor="excellent">Excellent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="good" id="good" />
                <Label htmlFor="good">Good</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fair" id="fair" />
                <Label htmlFor="fair">Fair</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="poor" id="poor" />
                <Label htmlFor="poor">Poor</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
  <Label>Are you experiencing any of the following symptoms? (Select all that apply)</Label>
  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
    {[
      "fatigue",
      "pain",
      "nausea",
      "sleep",
      "appetite",
      "breathing",
      "mobility",
      
    ].map((symptom) => (
      <CheckboxItem
        key={symptom}
        id={symptom}
        label={symptom.charAt(0).toUpperCase() + symptom.slice(1).replace('-', ' ')}
        checked={surveyData.physicalHealth.currentSymptoms.includes(symptom)}
        onCheckedChange={(checked) => {
          const updated = checked
            ? [...surveyData.physicalHealth.currentSymptoms, symptom]
            : surveyData.physicalHealth.currentSymptoms.filter(s => s !== symptom)
          updateSurveyData(3, { currentSymptoms: updated })
        }}
      />
    ))}
  </div>
</div>


          <div className="space-y-2">
            <Label>How often do you engage in physical activity?</Label>
            <RadioGroup defaultValue="2-3-times">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily">Daily</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2-3-times" id="2-3-times" />
                <Label htmlFor="2-3-times">2-3 times per week</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="once" id="once" />
                <Label htmlFor="once">Once a week</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="rarely" id="rarely" />
                <Label htmlFor="rarely">Rarely or never</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="physicalConcerns">Any specific physical concerns?</Label>
            <Textarea id="physicalConcerns" placeholder="Describe any physical concerns you'd like help with" />
          </div>
        </div>
      )

    case 4:
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>How would you rate your emotional wellbeing?</Label>
            <RadioGroup defaultValue="good">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excellent" id="emotional-excellent" />
                <Label htmlFor="emotional-excellent">Excellent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="good" id="emotional-good" />
                <Label htmlFor="emotional-good">Good</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fair" id="emotional-fair" />
                <Label htmlFor="emotional-fair">Fair</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="poor" id="emotional-poor" />
                <Label htmlFor="emotional-poor">Poor</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
  <Label>Are you experiencing any of the following? (Select all that apply)</Label>
  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
    {[
      { id: "anxiety", label: "Anxiety" },
      { id: "depression", label: "Depression" },
      { id: "fear", label: "Fear of Recurrence" },
      { id: "grief", label: "Grief" },
      { id: "isolation", label: "Feelings of Isolation" },
      { id: "relationship", label: "Relationship Challenges" },
      { id: "body-image", label: "Body Image Concerns" },
      { id: "identity", label: "Identity Changes" },
    ].map(({ id, label }) => (
      <CheckboxItem
        key={id}
        id={id}
        label={label}
        checked={surveyData.emotionalWellbeing.concerns.includes(id)}
        onCheckedChange={(checked) => {
          const updatedConcerns = checked
            ? [...surveyData.emotionalWellbeing.concerns, id]
            : surveyData.emotionalWellbeing.concerns.filter(item => item !== id)
          updateSurveyData(4, { concerns: updatedConcerns })
        }}
      />
    ))}
  </div>
</div>

          <div className="space-y-2">
            <Label>Do you have a support system?</Label>
            <RadioGroup defaultValue="yes-strong">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes-strong" id="yes-strong" />
                <Label htmlFor="yes-strong">Yes, strong support system</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes-limited" id="yes-limited" />
                <Label htmlFor="yes-limited">Yes, but limited</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="no" />
                <Label htmlFor="no">No support system</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="emotionalConcerns">Any specific emotional concerns?</Label>
            <Textarea id="emotionalConcerns" placeholder="Describe any emotional concerns you'd like help with" />
          </div>
        </div>
      )

    case 5:
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>How would you describe your diet?</Label>
            <RadioGroup defaultValue="balanced">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="balanced" id="balanced" />
                <Label htmlFor="balanced">Balanced and healthy</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="mostly-healthy" id="mostly-healthy" />
                <Label htmlFor="mostly-healthy">Mostly healthy with occasional indulgences</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="needs-improvement" id="needs-improvement" />
                <Label htmlFor="needs-improvement">Needs improvement</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="poor" id="diet-poor" />
                <Label htmlFor="diet-poor">Poor</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label>How is your sleep quality?</Label>
            <RadioGroup defaultValue="good">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="excellent" id="sleep-excellent" />
                <Label htmlFor="sleep-excellent">Excellent</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="good" id="sleep-good" />
                <Label htmlFor="sleep-good">Good</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fair" id="sleep-fair" />
                <Label htmlFor="sleep-fair">Fair</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="poor" id="sleep-poor" />
                <Label htmlFor="sleep-poor">Poor</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
  <Label>What are your primary goals for recovery? (Select all that apply)</Label>
  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
    {[
      { id: "physical-strength", label: "Regain Physical Strength" },
      { id: "emotional-balance", label: "Improve Emotional Balance" },
      { id: "nutrition", label: "Better Nutrition" },
      { id: "sleep-improvement", label: "Improve Sleep" },
      { id: "social-connections", label: "Rebuild Social Connections" },
      { id: "work-return", label: "Return to Work" },
      { id: "family-balance", label: "Family Life Balance" },
      { id: "long-term-health", label: "Long-term Health Management" },
    ].map(({ id, label }) => (
      <CheckboxItem
        key={id}
        id={id}
        label={label}
        checked={surveyData.lifestyleGoals.goals.includes(id)}
        onCheckedChange={(checked) => {
          const updatedGoals = checked
            ? [...surveyData.lifestyleGoals.goals, id]
            : surveyData.lifestyleGoals.goals.filter(goal => goal !== id)
          updateSurveyData(5, { goals: updatedGoals })
        }}
      />
    ))}
  </div>
</div>


          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Anything else you'd like to share?</Label>
            <Textarea
              id="additionalInfo"
              placeholder="Any additional information that might help us create your personalized care plan"
            />
          </div>
        </div>
      )

      case 6:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>What is your smoking status?</Label>
              <RadioGroup
                value={surveyData.lifestyleRisk.smokingStatus}
                onValueChange={(value) => updateSurveyData(6, { smokingStatus: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="never" id="smoking-never" />
                  <Label htmlFor="smoking-never">Never-I have never smoked or used tobacco products</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="former" id="smoking-former" />
                  <Label htmlFor="smoking-former">Former-I used to smoke but have quit</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="current" id="smoking-current" />
                  <Label htmlFor="smoking-current">Current-I currently smoke or use tobacco products</Label>
                </div>
              </RadioGroup>
            </div>
      
            <div className="space-y-2">
              <Label> What best describes your alcohol consumption?</Label>
              <RadioGroup
                value={surveyData.lifestyleRisk.alcoholUse}
                onValueChange={(value) => updateSurveyData(6, { alcoholUse: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="never" id="alcohol-never" />
                  <Label htmlFor="alcohol-never">Never-I do not drink alcohol</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="occasionally" id="alcohol-occasionally" />
                  <Label htmlFor="alcohol-occasionally">Occasionally-I drink alcohol rarely or on social occasions</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="regularly" id="alcohol-regularly" />
                  <Label htmlFor="alcohol-regularly">Regularly-I drink alcohol on a regular basis (e.g., weekly or more)</Label>
                </div>
              </RadioGroup>
            </div>
      
            <div className="space-y-2">
              <Label> How would you classify your current level of health risk or need for follow-up care?</Label>
              <RadioGroup
                value={surveyData.lifestyleRisk.riskStratification}
                onValueChange={(value) => updateSurveyData(6, { riskStratification: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="risk-low" />
                  <Label htmlFor="risk-low">Low-I am generally healthy and not experiencing ongoing issues</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="risk-medium" />
                  <Label htmlFor="risk-medium">Medium-I have some ongoing health concerns that may need attention</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="risk-high" />
                  <Label htmlFor="risk-high">High-I have multiple or serious concerns that require active medical follow-up</Label>
                </div>
              </RadioGroup>
            </div>
      
            <div className="space-y-2">
              <Label>Do you have any known cardiovascular risk?</Label>
              <RadioGroup
                value={surveyData.lifestyleRisk.cardiovascularRisk ? "yes" : "no"}
                onValueChange={(value) => updateSurveyData(6, { cardiovascularRisk: value === "yes" })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="cardio-yes" />
                  <Label htmlFor="cardio-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="cardio-no" />
                  <Label htmlFor="cardio-no">No</Label>
                </div>
              </RadioGroup>
            </div>
      
            <div className="space-y-2">
              <Label>Are you currently experiencing or concerned about fertility or reproductive health issues?</Label>
              <RadioGroup
                value={surveyData.lifestyleRisk.fertilityConcern ? "yes" : "no"}
                onValueChange={(value) => updateSurveyData(6, { fertilityConcern: value === "yes" })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="fertility-yes" />
                  <Label htmlFor="fertility-yes">Yes-I have concerns </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="fertility-no" />
                  <Label htmlFor="fertility-no">No- I have no concerns</Label>
                </div>
              </RadioGroup>
            </div>
      
            <div className="space-y-2">
              <Label> How do you generally cope with challenges related to your cancer experience and recovery?</Label>
              <RadioGroup
                value={surveyData.lifestyleRisk.copingStyle}
                onValueChange={(value) => updateSurveyData(6, { copingStyle: value })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="adaptive" id="coping-adaptive" />
                  <Label htmlFor="coping-adaptive">Adaptive-I actively try to manage challenges in healthy ways (e.g., talking to someone, using relaxation techniques, staying informed, problem-solving)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="avoidant" id="coping-avoidant" />
                  <Label htmlFor="coping-avoidant">Avoidant-I tend to push aside emotions or avoid thinking about the situation (e.g., ignoring feelings, withdrawing, distracting myself)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="unsure" id="coping-unsure" />
                  <Label htmlFor="coping-unsure">Unsure- I’m not sure how I usually cope, or it varies</Label>
                </div>
              </RadioGroup>
            </div>
      
            <div className="space-y-2">
              <Label> Have you experienced emotional or psychological trauma related to your cancer diagnosis or treatment?</Label>
              <RadioGroup
                value={surveyData.lifestyleRisk.ptsdFlag ? "yes" : "no"}
                onValueChange={(value) => updateSurveyData(6, { ptsdFlag: value === "yes" })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="ptsd-yes" />
                  <Label htmlFor="ptsd-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="ptsd-no" />
                  <Label htmlFor="ptsd-no">No</Label>
                </div>
              </RadioGroup>
            </div>
      
            <div className="space-y-2">
              <Label htmlFor="cognitiveFunctionScore">How would you rate your current cognitive functioning (e.g., memory, concentration, mental clarity)?</Label>
              <select
                id="cognitiveFunctionScore"
                className="w-full border p-2"
                value={surveyData.lifestyleRisk.cognitiveFunctionScore}
                onChange={(e) => updateSurveyData(6, { cognitiveFunctionScore: e.target.value })}
              >
                <option value="">Select score</option>
                <option value="excellent">Excellent-No noticeable issues with memory, focus, or mental clarity</option>
                <option value="good">Good-Minor occasional issues, but generally functioning well</option>
                <option value="fair">Fair-Moderate difficulty with thinking, memory, or attention</option>
                <option value="poor">Poor-Frequent or serious cognitive issues affecting daily life</option>
              </select>
            </div>
          </div>
        )
      

    case 7:
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>On a scale of 1 to 5, how satisfied are you with the coordination of your care during and after your cancer treatment? ( means "Very Dissatisfied" and 5 means "Very Satisfied".)</Label>
            <Input
              type="number"
              min={1}
              max={5}
              value={surveyData.perceptions.careCoordinationScore}
              onChange={(e) =>
                updateSurveyData(7, { careCoordinationScore: parseInt(e.target.value) })
              }
            />
          </div>

          <div className="space-y-2">
            <Label>How willing are you to make lifestyle changes (such as improving diet, exercise, or stress management) to support your recovery and long-term health?</Label>
            <RadioGroup
              value={surveyData.perceptions.lifestyleChangeEffort}
              onValueChange={(value) =>
                updateSurveyData(7, { lifestyleChangeEffort: value })
              }
            >
              <RadioGroupItem value="very-willing" id="very-willing" />
              <Label htmlFor="very-willing">Very Willing-I’m ready and motivated to make lifestyle changes</Label>
              <RadioGroupItem value="somewhat-willing" id="somewhat-willing" />
              <Label htmlFor="somewhat-willing">Somewhat Willing-I’m open to change but may need guidance or support</Label>
              <RadioGroupItem value="not-willing" id="not-willing" />
              <Label htmlFor="not-willing">Not Willing-I’m not ready to make lifestyle changes at this time</Label>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label>On a scale of 0 to 10, how much fear or worry do you currently have about your cancer coming back (recurrence)?</Label>
            <Input
              type="number"
              min={0}
              max={10}
              value={surveyData.perceptions.fearOfRecurrenceScore}
              onChange={(e) =>
                updateSurveyData(7, { fearOfRecurrenceScore: parseInt(e.target.value) })
              }
            />
          </div>

          <CheckboxItem
            id="noIssues"
            label="I have no significant issues at present"
            checked={surveyData.perceptions.noSignificantIssues}
            onCheckedChange={(checked) =>
              updateSurveyData(7, { noSignificantIssues: checked })
            }
          />

          <CheckboxItem
            id="stress"
            label="I experience stress regularly"
            checked={surveyData.perceptions.stress}
            onCheckedChange={(checked) =>
              updateSurveyData(7, { stress: checked })
            }
          />

          <div className="space-y-2">
            <Label htmlFor="lateEffectSymptoms">Describe any late effects or long-term symptoms</Label>
            <Textarea
              id="lateEffectSymptoms"
              value={surveyData.perceptions.lateEffectSymptoms}
              onChange={(e) =>
                updateSurveyData(7, { lateEffectSymptoms: e.target.value })
              }
            />
          </div>
        </div>
      )


    default:
      return null
  }
}

interface CheckboxItemProps {
  id: string
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

function CheckboxItem({ id, label, checked, onCheckedChange }: CheckboxItemProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox 
        id={id} 
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
      <Label htmlFor={id}>{label}</Label>
    </div>
  )
}

function flattenSurveyData(surveyData: SurveyData) {
  return {
    // Personal Info
    firstName: surveyData.personalInfo.firstName,
    lastName: surveyData.personalInfo.lastName,
    email: surveyData.personalInfo.email,
    dateOfBirth: new Date(surveyData.personalInfo.dob),
    gender: surveyData.personalInfo.gender,

    // Treatment History
    typeOfCancer: surveyData.treatmentHistory.cancerType,
    dateOfDiagnosis: new Date(surveyData.treatmentHistory.diagnosisDate),
    dateTreatmentEnded: new Date(surveyData.treatmentHistory.treatmentEndDate)  ,
    treatmentsReceived: surveyData.treatmentHistory.treatments,
    otherTreatments: surveyData.treatmentHistory.otherTreatments,

    // Physical Health
    physicalHealth: "N/A", // Placeholder or compute from symptoms if needed// if you have this field
    symptoms: surveyData.physicalHealth.currentSymptoms,
    physicalActivity: surveyData.lifestyleGoals.exercise, // Comes from lifestyleGoals // if you have this field
    physicalConcerns: surveyData.physicalHealth.otherSymptoms,

    // Emotional Wellbeing
    emotionalWellbeing: surveyData.emotionalWellbeing.mood,
    emotionalSymptoms: Array.isArray(surveyData.emotionalWellbeing.concerns)
      ? surveyData.emotionalWellbeing.concerns
      : surveyData.emotionalWellbeing.concerns
        ? [surveyData.emotionalWellbeing.concerns]
        : [],
    supportSystem: surveyData.emotionalWellbeing.supportSystem,
    emotionalConcerns: surveyData.emotionalWellbeing.concerns,

    // Lifestyle & Goals
    diet: surveyData.lifestyleGoals.diet,
    sleepQuality: surveyData.lifestyleGoals.sleep,
    recoveryGoals: Array.isArray(surveyData.lifestyleGoals.goals)
      ? surveyData.lifestyleGoals.goals
      : surveyData.lifestyleGoals.goals
        ? [surveyData.lifestyleGoals.goals]
        : [],
    additionalInfo: surveyData.lifestyleGoals.additionalInfo, // if you have this field

     // Step 6: Lifestyle Risk
smokingStatus: surveyData.lifestyleRisk.smokingStatus,
alcoholUse: surveyData.lifestyleRisk.alcoholUse,
riskStratification: surveyData.lifestyleRisk.riskStratification,
cardiovascularRisk: surveyData.lifestyleRisk.cardiovascularRisk,
fertilityConcern: surveyData.lifestyleRisk.fertilityConcern,
copingStyle: surveyData.lifestyleRisk.copingStyle,
ptsdFlag: surveyData.lifestyleRisk.ptsdFlag,
cognitiveFunctionScore: surveyData.lifestyleRisk.cognitiveFunctionScore,

// Step 7: Perceptions
careCoordinationScore: surveyData.perceptions.careCoordinationScore,
lifestyleChangeEffort: surveyData.perceptions.lifestyleChangeEffort,
fearOfRecurrenceScore: surveyData.perceptions.fearOfRecurrenceScore,
noSignificantIssues: surveyData.perceptions.noSignificantIssues,
stress: surveyData.perceptions.stress,
lateEffectSymptoms: surveyData.perceptions.lateEffectSymptoms,

  };
}
