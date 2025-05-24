"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { UserNav } from "@/components/user-nav"
import { getCurrentUser } from "@/lib/auth-actions"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, Phone, Calendar, MapPin, Shield, Bell, Lock } from "lucide-react"

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    bio: "",
  })

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

        // Initialize profile data with user data
        setProfileData({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          email: userData.email || "",
          phone: "555-123-4567", // Mock data
          dateOfBirth: "1975-06-15", // Mock data
          address: "123 Main St, Anytown, USA", // Mock data
          bio: "Cancer survivor since 2023. I enjoy gardening, reading, and spending time with my family.", // Mock data
        })
      } catch (error) {
        console.error("Error loading user:", error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [router])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveProfile = () => {
    // In a real app, this would save to the database
    toast({
      title: "Profile updated",
      description: "Your profile information has been updated successfully.",
    })
    setIsEditing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-parchment flex items-center justify-center">
        <div className="text-forest-green">Loading...</div>
      </div>
    )
  }

  const initials = `${profileData.firstName?.[0] || ""}${profileData.lastName?.[0] || ""}`.toUpperCase()

  return (
    <div className="min-h-screen bg-parchment">
      <header className="bg-white shadow-sm py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold text-forest-green mb-4 sm:mb-0">Your Profile</h1>
          <UserNav user={user} />
        </div>
      </header>

      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="grid grid-cols-3 gap-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="medical">Medical History</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card className="border-none shadow-md">
                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <Avatar className="h-24 w-24 border-2 border-gray-200">
                      <AvatarFallback className="bg-dusty-blue/10 text-forest-green text-2xl">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-center sm:text-left">
                      <CardTitle className="text-2xl text-forest-green">
                        {profileData.firstName} {profileData.lastName}
                      </CardTitle>
                      <CardDescription className="text-gray-600">
                        {user?.userType === "admin" ? "Healthcare Administrator" : "Cancer Survivor"}
                      </CardDescription>
                      <p className="mt-2 text-sm text-gray-500">Member since April 2025</p>
                    </div>
                    <div>
                      {isEditing ? (
                        <div className="flex gap-2">
                          <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                          </Button>
                          <Button className="bg-forest-green hover:bg-forest-green/90" onClick={handleSaveProfile}>
                            Save
                          </Button>
                        </div>
                      ) : (
                        <Button className="bg-forest-green hover:bg-forest-green/90" onClick={() => setIsEditing(true)}>
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {isEditing ? (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={profileData.firstName}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={profileData.lastName}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" name="email" value={profileData.email} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone</Label>
                          <Input id="phone" name="phone" value={profileData.phone} onChange={handleInputChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth">Date of Birth</Label>
                          <Input
                            id="dateOfBirth"
                            name="dateOfBirth"
                            type="date"
                            value={profileData.dateOfBirth}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address">Address</Label>
                          <Input id="address" name="address" value={profileData.address} onChange={handleInputChange} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" name="bio" value={profileData.bio} onChange={handleInputChange} rows={4} />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <ProfileInfoItem
                          icon={<User className="h-5 w-5 text-dusty-blue" />}
                          label="Full Name"
                          value={`${profileData.firstName} ${profileData.lastName}`}
                        />
                        <ProfileInfoItem
                          icon={<Mail className="h-5 w-5 text-dusty-blue" />}
                          label="Email"
                          value={profileData.email}
                        />
                        <ProfileInfoItem
                          icon={<Phone className="h-5 w-5 text-dusty-blue" />}
                          label="Phone"
                          value={profileData.phone}
                        />
                        <ProfileInfoItem
                          icon={<Calendar className="h-5 w-5 text-dusty-blue" />}
                          label="Date of Birth"
                          value={new Date(profileData.dateOfBirth).toLocaleDateString()}
                        />
                        <ProfileInfoItem
                          icon={<MapPin className="h-5 w-5 text-dusty-blue" />}
                          label="Address"
                          value={profileData.address}
                        />
                        <ProfileInfoItem
                          icon={<Shield className="h-5 w-5 text-dusty-blue" />}
                          label="Account Type"
                          value={user?.userType === "admin" ? "Healthcare Administrator" : "Cancer Survivor"}
                        />
                      </div>
                      <div className="pt-4 border-t border-gray-100">
                        <h3 className="text-md font-medium text-gray-700 mb-2">About Me</h3>
                        <p className="text-gray-600">{profileData.bio}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="medical" className="space-y-6">
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl text-forest-green">Medical History</CardTitle>
                  <CardDescription>Your medical information and history</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-md font-medium text-gray-700">Cancer Diagnosis</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ProfileInfoItem label="Cancer Type" value="Breast Cancer, Stage II" />
                      <ProfileInfoItem label="Diagnosis Date" value="June 2023" />
                      <ProfileInfoItem label="Treatment End Date" value="January 2024" />
                      <ProfileInfoItem label="Oncologist" value="Dr. Sarah Johnson" />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h3 className="text-md font-medium text-gray-700">Treatments Received</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <li className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-dusty-blue"></div>
                        <span className="text-gray-600">Surgery (Lumpectomy)</span>
                      </li>
                      <li className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-dusty-blue"></div>
                        <span className="text-gray-600">Chemotherapy</span>
                      </li>
                      <li className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-dusty-blue"></div>
                        <span className="text-gray-600">Radiation Therapy</span>
                      </li>
                      <li className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-dusty-blue"></div>
                        <span className="text-gray-600">Hormone Therapy</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h3 className="text-md font-medium text-gray-700">Current Medications</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-dusty-blue"></div>
                        <span className="text-gray-600">Tamoxifen (20mg, daily)</span>
                      </li>
                      <li className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-dusty-blue"></div>
                        <span className="text-gray-600">Vitamin D (1000 IU, daily)</span>
                      </li>
                      <li className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-dusty-blue"></div>
                        <span className="text-gray-600">Calcium supplement (500mg, twice daily)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h3 className="text-md font-medium text-gray-700">Allergies</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-dusty-blue"></div>
                        <span className="text-gray-600">Penicillin</span>
                      </li>
                      <li className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-dusty-blue"></div>
                        <span className="text-gray-600">Shellfish</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-forest-green hover:bg-forest-green/90">Update Medical Information</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card className="border-none shadow-md">
                <CardHeader>
                  <CardTitle className="text-xl text-forest-green">Security Settings</CardTitle>
                  <CardDescription>Manage your account security and preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-md font-medium text-gray-700">Password</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input id="confirmPassword" type="password" />
                      </div>
                    </div>
                    <Button className="bg-forest-green hover:bg-forest-green/90 mt-2">Update Password</Button>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-dusty-blue" />
                        <h3 className="text-md font-medium text-gray-700">Notification Preferences</h3>
                      </div>
                      <Button variant="outline" className="border-dusty-blue text-dusty-blue hover:bg-dusty-blue/10">
                        Edit
                      </Button>
                    </div>
                    <ul className="space-y-2">
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600">Email notifications</span>
                        <span className="text-forest-green font-medium">Enabled</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600">Care plan updates</span>
                        <span className="text-forest-green font-medium">Enabled</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600">Appointment reminders</span>
                        <span className="text-forest-green font-medium">Enabled</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600">Resource recommendations</span>
                        <span className="text-gray-500">Disabled</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Lock className="h-5 w-5 text-dusty-blue" />
                        <h3 className="text-md font-medium text-gray-700">Privacy Settings</h3>
                      </div>
                      <Button variant="outline" className="border-dusty-blue text-dusty-blue hover:bg-dusty-blue/10">
                        Edit
                      </Button>
                    </div>
                    <ul className="space-y-2">
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600">Share data with healthcare providers</span>
                        <span className="text-forest-green font-medium">Enabled</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600">Participate in research studies</span>
                        <span className="text-forest-green font-medium">Enabled</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-gray-600">Share anonymous data for platform improvement</span>
                        <span className="text-forest-green font-medium">Enabled</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md bg-red-50">
                <CardHeader>
                  <CardTitle className="text-xl text-red-600">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    These actions are permanent and cannot be undone. Please proceed with caution.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-100">
                      Delete All Data
                    </Button>
                    <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-100">
                      Deactivate Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

function ProfileInfoItem({ icon, label, value }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-sm text-gray-500">{label}</p>
      </div>
      <p className="text-gray-700 font-medium">{value}</p>
    </div>
  )
}
