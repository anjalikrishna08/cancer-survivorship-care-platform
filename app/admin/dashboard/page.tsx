"use client"

import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserNav } from "@/components/user-nav"
import { useToast } from "@/hooks/use-toast"
import { PieChart, Mail } from "lucide-react"

// ✅ NEW: Separate import from /lib/api-client.ts
import { getCurrentUser, isAdmin } from "@/lib/api-client"

export default function AdminDashboardPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await getCurrentUser()
        const adminCheck = await isAdmin()

        if (!userData || !adminCheck) {
          toast({
            title: "Access Denied",
            description: "You must be an administrator to access this page.",
            variant: "destructive",
          })
          router.push("/auth/login")
          return
        }

        setUser(userData)
      } catch (error) {
        console.error("Error loading user:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [router, toast])

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
          <h1 className="text-2xl font-bold text-forest-green mb-4 sm:mb-0">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline" className="border-dusty-blue text-dusty-blue hover:bg-dusty-blue/10">
              System Settings
            </Button>
            <UserNav user={user} />
          </div>
        </div>
      </header>

      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="users" className="space-y-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="care-plans">Care Plans</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-8">
              <AdminOverviewCards />
              <UserManagement />
            </TabsContent>

            <TabsContent value="care-plans" className="space-y-8">
              <CarePlanManagement />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-8">
              <AnalyticsDashboard />
            </TabsContent>

            <TabsContent value="settings" className="space-y-8">
              <SystemSettings />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

// Note: other component functions (AdminOverviewCards, UserManagement, etc.) stay unchanged and should remain below


function AdminOverviewCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-forest-green">Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-dusty-blue">128</div>
          <p className="text-sm text-gray-500">+12 this month</p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-forest-green">Active Care Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-mist-green">98</div>
          <p className="text-sm text-gray-500">76% of users</p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-forest-green">Survey Completion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-forest-green">82%</div>
          <p className="text-sm text-gray-500">+5% from last month</p>
        </CardContent>
      </Card>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-forest-green">Support Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-dusty-blue">7</div>
          <p className="text-sm text-gray-500">3 pending responses</p>
        </CardContent>
      </Card>
    </div>
  )
}

function UserManagement() {
  // Mock user data
  const users = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      type: "patient",
      status: "active",
      lastLogin: "2025-04-23",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "m.chen@example.com",
      type: "patient",
      status: "active",
      lastLogin: "2025-04-22",
    },
    {
      id: 3,
      name: "Emma Williams",
      email: "emma.w@example.com",
      type: "patient",
      status: "inactive",
      lastLogin: "2025-04-10",
    },
    {
      id: 4,
      name: "James Rodriguez",
      email: "j.rodriguez@example.com",
      type: "patient",
      status: "active",
      lastLogin: "2025-04-21",
    },
    {
      id: 5,
      name: "Dr. Lisa Taylor",
      email: "lisa.t@hospital.org",
      type: "admin",
      status: "active",
      lastLogin: "2025-04-24",
    },
  ]

  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl text-forest-green">User Management</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </div>
          <Button className="bg-forest-green hover:bg-forest-green/90">Add User</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.type === "admin" ? "bg-dusty-blue/10 text-dusty-blue" : "bg-mist-green/10 text-mist-green"
                    }`}
                  >
                    {user.type === "admin" ? "Administrator" : "Patient"}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      user.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.status === "active" ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell>{user.lastLogin}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-dusty-blue text-dusty-blue hover:bg-dusty-blue/10"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-gray-500">Showing 5 of 128 users</div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

function CarePlanManagement() {
  // Mock care plan data
  const carePlans = [
    { id: 1, user: "Sarah Johnson", created: "2025-04-15", updated: "2025-04-20", status: "active" },
    { id: 2, user: "Michael Chen", created: "2025-04-10", updated: "2025-04-20", status: "active" },
    { id: 3, user: "Emma Williams", created: "2025-03-25", updated: "2025-03-25", status: "inactive" },
    { id: 4, user: "James Rodriguez", created: "2025-04-18", updated: "2025-04-18", status: "active" },
  ]

  return (
    <Card className="border-none shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl text-forest-green">Care Plan Management</CardTitle>
            <CardDescription>View and manage patient care plans</CardDescription>
          </div>
          <Button className="bg-forest-green hover:bg-forest-green/90">Create Care Plan</Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Patient</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {carePlans.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">CP-{plan.id.toString().padStart(4, "0")}</TableCell>
                <TableCell>{plan.user}</TableCell>
                <TableCell>{plan.created}</TableCell>
                <TableCell>{plan.updated}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      plan.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {plan.status === "active" ? "Active" : "Inactive"}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-dusty-blue text-dusty-blue hover:bg-dusty-blue/10"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-gray-500">Showing 4 of 98 care plans</div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-forest-green">System Analytics</CardTitle>
          <CardDescription>Overview of platform usage and engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
            <div className="text-center">
              <PieChart className="h-12 w-12 text-dusty-blue mx-auto mb-4" />
              <p className="text-gray-500">Analytics visualization would appear here</p>
              <p className="text-sm text-gray-400">
                User engagement, survey completion rates, and care plan utilization
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-forest-green">Most Used Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex justify-between items-center">
                <span className="text-gray-700">Nutrition for Cancer Survivors</span>
                <span className="text-dusty-blue font-medium">78% usage</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-700">Exercise Guidelines</span>
                <span className="text-dusty-blue font-medium">65% usage</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-700">Emotional Support Resources</span>
                <span className="text-dusty-blue font-medium">62% usage</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-700">Sleep Improvement Guide</span>
                <span className="text-dusty-blue font-medium">54% usage</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-700">Pain Management Techniques</span>
                <span className="text-dusty-blue font-medium">47% usage</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg text-forest-green">User Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex justify-between items-center">
                <span className="text-gray-700">Average Daily Active Users</span>
                <span className="text-forest-green font-medium">42</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-700">Average Session Duration</span>
                <span className="text-forest-green font-medium">12 minutes</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-700">Chatbot Interactions</span>
                <span className="text-forest-green font-medium">215 this week</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-700">Care Plan Downloads</span>
                <span className="text-forest-green font-medium">68 this month</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-gray-700">Email Shares</span>
                <span className="text-forest-green font-medium">42 this month</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function SystemSettings() {
  return (
    <div className="space-y-6">
      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-forest-green">System Configuration</CardTitle>
          <CardDescription>Manage platform settings and configurations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-forest-green">General Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Platform Name</label>
                <Input defaultValue="Cancer Survivorship Care" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Support Email</label>
                <Input defaultValue="support@cancercare.org" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Default Language</label>
                <Input defaultValue="English" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Time Zone</label>
                <Input defaultValue="UTC-5 (Eastern Time)" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-forest-green">Email Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">SMTP Server</label>
                <Input defaultValue="smtp.cancercare.org" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">SMTP Port</label>
                <Input defaultValue="587" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email From Name</label>
                <Input defaultValue="Cancer Survivorship Care" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email From Address</label>
                <Input defaultValue="no-reply@cancercare.org" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium text-forest-green">AI Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">AI Model</label>
                <Input defaultValue="GPT-4o" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">API Key</label>
                <Input type="password" defaultValue="••••••••••••••••" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Max Tokens</label>
                <Input defaultValue="4096" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Temperature</label>
                <Input defaultValue="0.7" />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-4">
          <Button variant="outline">Cancel</Button>
          <Button className="bg-forest-green hover:bg-forest-green/90">Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
