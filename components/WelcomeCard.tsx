// File: components/WelcomeCard.tsx
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Download } from "lucide-react"

interface WelcomeCardProps {
  user: {
    firstName?: string
  }
  onDownload: () => void
  onSendEmail: () => void
  sendingEmail: boolean
}

export function WelcomeCard({
  user,
  onDownload,
  onSendEmail,
  sendingEmail,
}: WelcomeCardProps) {
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



  

