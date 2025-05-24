"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChatInterface } from "@/components/chat-interface"
import { UserNav } from "@/components/user-nav"
import { useToast } from "@/hooks/use-toast"
import { sendCarePlanByEmail } from "@/lib/email-actions"
import { Download, Mail } from "lucide-react"
import  ResourcesTab  from "@/components/resources-tab"

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
  const [carePlan, setCarePlan] = useState<string>("")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const userData = getCookieValue("userData")
    if (!userData) {
      router.push("/auth/login")
      return
    }
    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    fetch(`/api/care-plan?userId=${parsedUser.id}`)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text()
          console.error(`❌ Care plan fetch failed: ${res.status}`, text)
          return
        }
        return res.json()
      })
      .then((data) => {
        if (data && data.description) {
          setCarePlan(data.description)
        }
      })
      .catch((err) => console.error("❌ Error fetching care plan:", err))

    setLoading(false)
  }, [router])

  const handleDownloadCarePlan = () => {
    const plainText = carePlan.replace(/<[^>]+>/g, '')
    const blob = new Blob([plainText], { type: "application/pdf" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "Care_Plan.pdf"
    a.click()
    window.URL.revokeObjectURL(url)

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
    return <div className="min-h-screen bg-parchment flex items-center justify-center text-forest-green">Loading...</div>
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

            <TabsContent value="care-plan" className="space-y-8 px-2">
              {carePlan ? (
                <>
                  <h2 className="text-xl font-bold text-forest-green text-center">Your Personalized Care Plan</h2>
                  <div className="bg-white px-6 py-8 rounded-lg border border-dusty-blue shadow max-w-2xl mx-auto">
                    <div
                      className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-800"
                      dangerouslySetInnerHTML={{ __html: carePlan }}
                    />
                  </div>
                </>
              ) : (
                <p className="text-gray-500 italic">No care plan available yet.</p>
              )}

              <div className="flex space-x-4 justify-center">
                <Button onClick={handleDownloadCarePlan} className="bg-dusty-blue text-white hover:bg-dusty-blue/90">
                  <Download className="mr-2 h-4 w-4" /> Download PDF
                </Button>
                <Button onClick={handleSendCarePlanByEmail} disabled={sendingEmail} className="bg-dusty-blue text-white hover:bg-dusty-blue/90">
                  <Mail className="mr-2 h-4 w-4" /> {sendingEmail ? "Sending..." : "Email to Me"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="progress" className="space-y-8">
              {/* Progress tab content */}
            </TabsContent>

            <TabsContent value="resources" className="space-y-8 px-2">
              <ResourcesTab />
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

