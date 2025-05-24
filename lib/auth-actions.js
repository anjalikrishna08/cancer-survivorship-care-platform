"use server"

import { cookies } from "next/headers"

// Mock database for demonstration purposes
// In a real application, you would use a database like Supabase, MongoDB, etc.
const mockUsers = [
  {
    id: "1",
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    password: "admin123", // In a real app, this would be hashed
    userType: "admin",
  },
  {
    id: "2",
    firstName: "Patient",
    lastName: "User",
    email: "patient@example.com",
    password: "patient123", // In a real app, this would be hashed
    userType: "patient",
  },
]

// Mock user database operations
const users = [...mockUsers]

export async function loginUser({ email, password }) {
  try {
    // In a real app, you would:
    // 1. Validate the input
    // 2. Query your database for the user
    // 3. Compare the password hash
    // 4. Create a session or JWT

    // For demo purposes, we'll just check against our mock data
    const user = users.find((u) => u.email === email)

    if (!user || user.password !== password) {
      return { success: false, error: "Invalid email or password" }
    }

    // Set a cookie to simulate authentication
    // In a real app, you would use a secure, HTTP-only cookie with a JWT
    cookies().set(
      "user_session",
      JSON.stringify({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        userType: user.userType,
      }),
      {
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      },
    )

    return {
      success: true,
      isAdmin: user.userType === "admin",
    }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "An error occurred during login" }
  }
}

export async function registerUser({ firstName, lastName, email, password, userType }) {
  try {
    // In a real app, you would:
    // 1. Validate the input
    // 2. Check if the user already exists
    // 3. Hash the password
    // 4. Store the user in your database

    // For demo purposes, we'll just add to our mock data
    const existingUser = users.find((u) => u.email === email)

    if (existingUser) {
      return { success: false, error: "User with this email already exists" }
    }

    const newUser = {
      id: String(users.length + 1),
      firstName,
      lastName,
      email,
      password, // In a real app, this would be hashed
      userType: userType || "patient", // Default to patient if not specified
    }

    users.push(newUser)

    return { success: true }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, error: "An error occurred during registration" }
  }
}

export async function logoutUser() {
  try {
    cookies().delete("user_session")
    return { success: true }
  } catch (error) {
    console.error("Logout error:", error)
    return { success: false, error: "An error occurred during logout" }
  }
}

export async function getCurrentUser() {
  try {
    const userCookie = cookies().get("session")

    if (!userCookie) {
      return null
    }

    return JSON.parse(userCookie.value)
  } catch (error) {
    console.error("Get current user error:", error)
    return null
  }
}

export async function isAuthenticated() {
  const user = await getCurrentUser()
  return !!user
}

export async function isAdmin() {
  const user = await getCurrentUser()
  return user?.userType === "admin"
}
export async function getCookieValue(name) {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) return decodeURIComponent(value);
  }
  return null;
}
