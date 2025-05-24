"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Calendar,
  Clock,
  Heart,
  Activity,
  Utensils,
  Brain,
  Users,
  FileText,
  ChevronRight,
  Download,
  Mail,
} from "lucide-react"
import { ChatInterface } from "@/components/chat-interface"
import { UserNav } from "@/components/user-nav"

import { useToast } from "@/hooks/use-toast"
import { sendCarePlanByEmail } from "@/lib/email-actions"

function getCookieValue(name: string) {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) return decodeURIComponent(value);
  }
  return null;
}


export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sendingEmail, setSendingEmail] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function loadUser() {
      try {
        // const userData = await getCurrentUser()
        const userData = getCookieValue('userData'); // replace with your cookie name

        if (!userData) {
          router.push("/auth/login")
          return
        }
        console.log("userData", userData)
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error("Error loading user:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [router])
  console.log("user out", user)

  const handleDownloadCarePlan = () => {
    // In a real application, this would generate a PDF and trigger a download
    // For this demo, we'll just show a toast notification
    toast({
      title: "Care Plan Downloaded",
      description: "Your personalized care plan has been downloaded successfully.",
    })
  }

  const handleSendCarePlanByEmail = async () => {
    setSendingEmail(true)
    try {
      const result = await sendCarePlanByEmail({ userId: user.id, email: user.email })

      if (result.success) {
        toast({
          title: "Care Plan Sent",
          description: "Your personalized care plan has been sent to your email.",
        })
      } else {
        toast({
          title: "Failed to Send",
          description: result.error || "An error occurred while sending your care plan.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "An error occurred",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setSendingEmail(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center">
        <div className="text-forest-green">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-parchment">
      <header className="bg-white shadow-sm py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold text-forest-green mb-4 sm:mb-0">Your Care Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="border-dusty-blue text-dusty-blue hover:bg-dusty-blue/10">
              Update Survey
            </Button>
            <UserNav user={user} />
          </div>
        </div>
      </header>

      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="care-plan" className="space-y-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <TabsTrigger value="care-plan">Care Plan</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="support">Support Chat</TabsTrigger>
            </TabsList>

            <TabsContent value="care-plan" className="space-y-8">
              <WelcomeCard
                user={user}
                onDownload={handleDownloadCarePlan}
                onSendEmail={handleSendCarePlanByEmail}
                sendingEmail={sendingEmail}
              />
              <CarePlanOverview />
              <RecommendationsSection />
            </TabsContent>

            <TabsContent value="progress" className="space-y-8">
              <ProgressTracking />
            </TabsContent>

            <TabsContent value="resources" className="space-y-8">
              <ResourcesSection />
            </TabsContent>

            <TabsContent value="support" className="space-y-8">
              <ChatInterface />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

function WelcomeCard({ user, onDownload, onSendEmail, sendingEmail }) {
  return (
    <Card className="border-none shadow-md bg-gradient-to-r from-dusty-blue/20 to-mist-green/20">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="text-2xl font-bold text-forest-green mb-2">Welcome back, {user?.firstName || "User"}</h2>
            <p className="text-gray-600">Your personalized care plan was last updated on April 20, 2025</p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-2">
            <Button
              className="bg-forest-green hover:bg-forest-green/90 text-white flex items-center"
              onClick={onDownload}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Care Plan
            </Button>
            <Button
              variant="outline"
              className="border-dusty-blue text-dusty-blue hover:bg-dusty-blue/10 flex items-center"
              onClick={onSendEmail}
              disabled={sendingEmail}
            >
              <Mail className="mr-2 h-4 w-4" />
              {sendingEmail ? "Sending..." : "Email Care Plan"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CarePlanOverview() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-forest-green">Your Care Plan Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <PriorityCard
          icon={<Heart className="h-6 w-6 text-dusty-blue" />}
          title="Physical Health"
          description="Focus on gentle exercise and managing fatigue"
          progress={65}
        />

        <PriorityCard
          icon={<Brain className="h-6 w-6 text-mist-green" />}
          title="Emotional Wellbeing"
          description="Practice daily mindfulness and join support group"
          progress={40}
        />

        <PriorityCard
          icon={<Utensils className="h-6 w-6 text-forest-green" />}
          title="Nutrition"
          description="Increase protein intake and stay hydrated"
          progress={75}
        />

        <PriorityCard
          icon={<Users className="h-6 w-6 text-dusty-blue" />}
          title="Social Support"
          description="Connect with local survivor group"
          progress={30}
        />
      </div>
    </div>
  )
}

function PriorityCard({ icon, title, description, progress }) {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          {icon}
          <CardTitle className="text-lg text-forest-green">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-600 mb-4">{description}</CardDescription>
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Progress</span>
            <span className="text-forest-green font-medium">{progress}%</span>
          </div>
          <Progress
            value={progress}
            className="h-2 bg-gray-200"
            indicatorClassName={`${progress > 66 ? "bg-mist-green" : progress > 33 ? "bg-dusty-blue" : "bg-forest-green/60"}`}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function RecommendationsSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-forest-green">Personalized Recommendations</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RecommendationCard
          icon={<Activity className="h-6 w-6 text-dusty-blue" />}
          title="Physical Activity"
          recommendations={[
            "Start with 10-minute walks, 3 times per week",
            "Try gentle yoga for flexibility and strength",
            "Consider aquatic exercises to reduce joint stress",
          ]}
        />

        <RecommendationCard
          icon={<Brain className="h-6 w-6 text-mist-green" />}
          title="Mental Health"
          recommendations={[
            "Practice 5-minute mindfulness meditation daily",
            "Join the online cancer survivor support group",
            "Schedule a consultation with a mental health specialist",
          ]}
        />

        <RecommendationCard
          icon={<Utensils className="h-6 w-6 text-forest-green" />}
          title="Nutrition"
          recommendations={[
            "Increase protein intake with lean meats and legumes",
            "Aim for 8 glasses of water daily",
            "Include more leafy greens and colorful vegetables",
          ]}
        />

        <RecommendationCard
          icon={<Clock className="h-6 w-6 text-dusty-blue" />}
          title="Follow-up Care"
          recommendations={[
            "Schedule your 3-month follow-up appointment",
            "Prepare questions for your oncologist",
            "Update your symptom journal before appointments",
          ]}
        />
      </div>
    </div>
  )
}

function RecommendationCard({ icon, title, recommendations }) {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          {icon}
          <CardTitle className="text-lg text-forest-green">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {recommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start">
              <div className="mr-2 mt-1 h-1.5 w-1.5 rounded-full bg-dusty-blue flex-shrink-0" />
              <span className="text-gray-700">{recommendation}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button variant="link" className="text-dusty-blue p-0 h-auto">
          View detailed plan <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

function ProgressTracking() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-forest-green">Your Recovery Journey</h2>

      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-lg text-forest-green">Progress Overview</CardTitle>
          <CardDescription>Track your improvement across different areas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ProgressItem label="Physical Strength" startValue={20} currentValue={65} targetValue={100} />
            <ProgressItem label="Emotional Wellbeing" startValue={30} currentValue={55} targetValue={100} />
            <ProgressItem label="Nutrition Goals" startValue={40} currentValue={75} targetValue={100} />
            <ProgressItem label="Sleep Quality" startValue={25} currentValue={60} targetValue={100} />
            <ProgressItem label="Social Connections" startValue={15} currentValue={45} targetValue={100} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-forest-green">Upcoming Milestones</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <MilestoneItem title="3-Month Follow-up Appointment" date="May 15, 2025" status="upcoming" />
              <MilestoneItem title="Complete 4-Week Exercise Program" date="May 22, 2025" status="in-progress" />
              <MilestoneItem title="Join Support Group Meeting" date="May 5, 2025" status="upcoming" />
              <MilestoneItem title="Nutrition Consultation" date="April 30, 2025" status="upcoming" />
            </ul>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-forest-green">Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <MilestoneItem title="Completed Initial Health Assessment" date="April 20, 2025" status="completed" />
              <MilestoneItem title="First Week of Daily Walking" date="April 18, 2025" status="completed" />
              <MilestoneItem title="Started Mindfulness Practice" date="April 15, 2025" status="completed" />
              <MilestoneItem title="Created Nutrition Plan" date="April 12, 2025" status="completed" />
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ProgressItem({ label, startValue, currentValue, targetValue }) {
  const percentage = Math.round(((currentValue - startValue) / (targetValue - startValue)) * 100)

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-gray-700 font-medium">{label}</span>
        <span className="text-sm text-forest-green">{percentage}% improvement</span>
      </div>
      <div className="relative pt-1">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-gray-500">Start</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-500">Target</span>
          </div>
        </div>
        <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
          <div className="bg-dusty-blue h-full" style={{ width: `${(currentValue / targetValue) * 100}%` }}></div>
        </div>
      </div>
    </div>
  )
}

function MilestoneItem({ title, date, status }) {
  const getStatusStyles = () => {
    switch (status) {
      case "completed":
        return {
          bgColor: "bg-mist-green",
          textColor: "text-mist-green",
          label: "Completed",
        }
      case "in-progress":
        return {
          bgColor: "bg-dusty-blue",
          textColor: "text-dusty-blue",
          label: "In Progress",
        }
      case "upcoming":
        return {
          bgColor: "bg-gray-300",
          textColor: "text-gray-500",
          label: "Upcoming",
        }
      default:
        return {
          bgColor: "bg-gray-300",
          textColor: "text-gray-500",
          label: "Planned",
        }
    }
  }

  const { bgColor, textColor, label } = getStatusStyles()

  return (
    <li className="flex items-start">
      <div className={`mr-3 mt-1 h-3 w-3 rounded-full ${bgColor} flex-shrink-0`}></div>
      <div className="flex-1">
        <div className="flex justify-between">
          <p className="font-medium text-gray-700">{title}</p>
          <span
            className={`text-xs font-medium ${textColor} px-2 py-0.5 rounded-full bg-opacity-10 ${bgColor.replace("bg-", "bg-opacity-10 bg-")}`}
          >
            {label}
          </span>
        </div>
        <p className="text-sm text-gray-500">{date}</p>
      </div>
    </li>
  )
}

function ResourcesSection() {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-forest-green">Recommended Resources</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ResourceCategory
          title="Educational Materials"
          icon={<FileText className="h-6 w-6 text-dusty-blue" />}
          resources={[
            { title: "Understanding Life After Cancer Treatment", type: "Guide" },
            { title: "Nutrition for Cancer Survivors", type: "E-book" },
            { title: "Managing Long-term Side Effects", type: "Video Series" },
            { title: "Exercise Guidelines for Recovery", type: "PDF Guide" },
          ]}
        />

        <ResourceCategory
          title="Support Groups"
          icon={<Users className="h-6 w-6 text-mist-green" />}
          resources={[
            { title: "Local Survivor Support Group", type: "In-person" },
            { title: "Online Peer Support Community", type: "Virtual" },
            { title: "Family Support Network", type: "Virtual" },
            { title: "Young Adult Survivors Group", type: "Hybrid" },
          ]}
        />

        <ResourceCategory
          title="Professional Services"
          icon={<Heart className="h-6 w-6 text-forest-green" />}
          resources={[
            { title: "Oncology Nutritionist Consultation", type: "Service" },
            { title: "Cancer Rehabilitation Specialist", type: "Provider" },
            { title: "Mental Health Counseling", type: "Service" },
            { title: "Financial Assistance Programs", type: "Resource" },
          ]}
        />
      </div>

      <Card className="border-none shadow-md bg-gradient-to-r from-dusty-blue/10 to-mist-green/10">
        <CardHeader>
          <CardTitle className="text-lg text-forest-green">Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <EventItem
              title="Cancer Survivorship Workshop"
              date="May 10, 2025"
              location="Virtual Event"
              description="Learn strategies for managing post-treatment life from experts and fellow survivors."
            />

            <EventItem
              title="Nutrition & Wellness Seminar"
              date="May 18, 2025"
              location="Community Center"
              description="Join our nutritionist for practical tips on healthy eating during recovery."
            />

            <EventItem
              title="Mindfulness Meditation Series"
              date="Starting May 5, 2025"
              location="Virtual Event"
              description="A 6-week guided meditation series designed specifically for cancer survivors."
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ResourceCategory({ title, icon, resources }) {
  return (
    <Card className="border-none shadow-md h-full">
      <CardHeader>
        <div className="flex items-center space-x-2">
          {icon}
          <CardTitle className="text-lg text-forest-green">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {resources.map((resource, index) => (
            <li key={index} className="border-b border-gray-100 last:border-0 pb-2 last:pb-0">
              <div className="flex justify-between">
                <span className="text-gray-700">{resource.title}</span>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{resource.type}</span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button variant="link" className="text-dusty-blue p-0 h-auto">
          View all resources <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

function EventItem({ title, date, location, description }) {
  return (
    <div className="flex space-x-4">
      <div className="flex-shrink-0 w-12 h-12 bg-white rounded-md shadow-sm flex items-center justify-center">
        <Calendar className="h-6 w-6 text-dusty-blue" />
      </div>
      <div>
        <h3 className="font-medium text-gray-800">{title}</h3>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <Calendar className="h-4 w-4 mr-1" />
          <span className="mr-3">{date}</span>
          <span>{location}</span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
        <Button variant="link" className="text-dusty-blue p-0 h-auto mt-1 text-sm">
          Learn more
        </Button>
      </div>
    </div>
  )
}
