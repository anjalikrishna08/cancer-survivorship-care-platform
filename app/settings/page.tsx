"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { UserNav } from "@/components/user-nav"
import { getCurrentUser } from "@/lib/auth-actions"
import { useToast } from "@/hooks/use-toast"
import { Bell, Moon, Globe, Volume2, Lock, Palette } from "lucide-react"

export default function SettingsPage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function loadUser() {
      try {
        const userData = await getCurrentUser()
        if (!userData) {
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
  }, [router])

  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    })
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
          <h1 className="text-2xl font-bold text-forest-green mb-4 sm:mb-0">Settings</h1>
          <UserNav user={user} />
        </div>
      </header>

      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="general" className="space-y-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="appearance">Appearance</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl text-forest-green">General Settings</CardTitle>
                  <CardDescription>Manage your account preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-md font-medium text-gray-700">Account Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="displayName">Display Name</Label>
                        <Input id="displayName" defaultValue={`${user.firstName} ${user.lastName}`} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" defaultValue={user.email} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-dusty-blue" />
                      <h3 className="text-md font-medium text-gray-700">Language & Region</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="language">Language</Label>
                        <Select defaultValue="en">
                          <SelectTrigger id="language">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="fr">French</SelectItem>
                            <SelectItem value="de">German</SelectItem>
                            <SelectItem value="zh">Chinese</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="timezone">Time Zone</Label>
                        <Select defaultValue="est">
                          <SelectTrigger id="timezone">
                            <SelectValue placeholder="Select time zone" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="est">Eastern Time (ET)</SelectItem>
                            <SelectItem value="cst">Central Time (CT)</SelectItem>
                            <SelectItem value="mst">Mountain Time (MT)</SelectItem>
                            <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                            <SelectItem value="utc">Coordinated Universal Time (UTC)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-5 w-5 text-dusty-blue" />
                      <h3 className="text-md font-medium text-gray-700">Accessibility</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="textSize">Text Size</Label>
                          <p className="text-sm text-gray-500">Adjust the size of text throughout the application</p>
                        </div>
                        <div className="w-[120px]">
                          <Select defaultValue="medium">
                            <SelectTrigger id="textSize">
                              <SelectValue placeholder="Text size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="small">Small</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="large">Large</SelectItem>
                              <SelectItem value="x-large">Extra Large</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Screen Reader Support</Label>
                          <p className="text-sm text-gray-500">Optimize content for screen readers</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Reduce Animations</Label>
                          <p className="text-sm text-gray-500">Minimize motion for those with vestibular disorders</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-forest-green hover:bg-forest-green/90" onClick={handleSaveSettings}>
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card className="border-none shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-dusty-blue" />
                    <CardTitle className="text-xl text-forest-green">Notification Settings</CardTitle>
                  </div>
                  <CardDescription>Control how and when you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-md font-medium text-gray-700">Email Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Care Plan Updates</Label>
                          <p className="text-sm text-gray-500">Receive emails when your care plan is updated</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Appointment Reminders</Label>
                          <p className="text-sm text-gray-500">Receive reminders about upcoming appointments</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Resource Recommendations</Label>
                          <p className="text-sm text-gray-500">
                            Get notified about new resources relevant to your journey
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Newsletter</Label>
                          <p className="text-sm text-gray-500">Receive our monthly newsletter with tips and updates</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h3 className="text-md font-medium text-gray-700">In-App Notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Chat Messages</Label>
                          <p className="text-sm text-gray-500">Receive notifications for new chat messages</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Milestone Achievements</Label>
                          <p className="text-sm text-gray-500">Get notified when you reach a recovery milestone</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>System Announcements</Label>
                          <p className="text-sm text-gray-500">Important announcements about the platform</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h3 className="text-md font-medium text-gray-700">Notification Frequency</h3>
                    <div className="space-y-2">
                      <Label>Email Digest Frequency</Label>
                      <Select defaultValue="daily">
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realtime">Real-time</SelectItem>
                          <SelectItem value="daily">Daily Digest</SelectItem>
                          <SelectItem value="weekly">Weekly Digest</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-forest-green hover:bg-forest-green/90" onClick={handleSaveSettings}>
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <Card className="border-none shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-dusty-blue" />
                    <CardTitle className="text-xl text-forest-green">Appearance Settings</CardTitle>
                  </div>
                  <CardDescription>Customize how the application looks</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Moon className="h-5 w-5 text-dusty-blue" />
                        <div className="space-y-0.5">
                          <Label>Dark Mode</Label>
                          <p className="text-sm text-gray-500">Switch between light and dark themes</p>
                        </div>
                      </div>
                      <Switch />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h3 className="text-md font-medium text-gray-700">Color Theme</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-full h-20 rounded-md bg-gradient-to-r from-dusty-blue/20 to-mist-green/20 border-2 border-forest-green"></div>
                        <span className="text-sm text-gray-600">Calming (Default)</span>
                      </div>
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-full h-20 rounded-md bg-gradient-to-r from-purple-100 to-pink-100 border border-gray-200"></div>
                        <span className="text-sm text-gray-600">Soothing</span>
                      </div>
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-full h-20 rounded-md bg-gradient-to-r from-blue-100 to-cyan-100 border border-gray-200"></div>
                        <span className="text-sm text-gray-600">Serene</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h3 className="text-md font-medium text-gray-700">Dashboard Layout</h3>
                    <Select defaultValue="default">
                      <SelectTrigger>
                        <SelectValue placeholder="Select layout" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">Default</SelectItem>
                        <SelectItem value="compact">Compact</SelectItem>
                        <SelectItem value="expanded">Expanded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="fontScale">Font Size</Label>
                        <p className="text-sm text-gray-500">Adjust the size of text throughout the application</p>
                      </div>
                    </div>
                    <div className="pt-2">
                      <Slider defaultValue={[50]} max={100} step={10} />
                      <div className="flex justify-between mt-1">
                        <span className="text-xs text-gray-500">A</span>
                        <span className="text-xs text-gray-500">A</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-forest-green hover:bg-forest-green/90" onClick={handleSaveSettings}>
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6">
              <Card className="border-none shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-dusty-blue" />
                    <CardTitle className="text-xl text-forest-green">Privacy Settings</CardTitle>
                  </div>
                  <CardDescription>Control your data and privacy preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-md font-medium text-gray-700">Data Sharing</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Share with Healthcare Providers</Label>
                          <p className="text-sm text-gray-500">Allow your healthcare providers to access your data</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Participate in Research</Label>
                          <p className="text-sm text-gray-500">Contribute anonymized data to cancer research</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Platform Improvement</Label>
                          <p className="text-sm text-gray-500">Allow usage data to improve the platform</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h3 className="text-md font-medium text-gray-700">Account Privacy</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Two-Factor Authentication</Label>
                          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Login Notifications</Label>
                          <p className="text-sm text-gray-500">Get notified of new logins to your account</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h3 className="text-md font-medium text-gray-700">Data Management</h3>
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full sm:w-auto">
                        Download My Data
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full sm:w-auto text-red-600 border-red-200 hover:bg-red-50"
                      >
                        Delete All My Data
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Deleting your data will permanently remove all your information from our systems. This action
                      cannot be undone.
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-forest-green hover:bg-forest-green/90" onClick={handleSaveSettings}>
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
