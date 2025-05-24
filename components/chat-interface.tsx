"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SendHorizontal, Bot, User } from "lucide-react"
import { getOpenAIResponse } from "@/lib/openai"

type Message = {
  role: "assistant" | "user"
  content: string
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI support companion. How can I help you with your cancer recovery journey today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() === "") return

    const userMessage = {
      role: "user" as const,
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      console.log("Sending prompt to OpenAI:", input)
      const openaiResponse = await getOpenAIResponse(input)

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: openaiResponse,
        },
      ])
    } catch (error) {
      console.error("Error generating response:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I encountered an error. Please try again later.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-none shadow-md h-[600px] flex flex-col">
      <CardHeader className="bg-dusty-blue/10 rounded-t-lg">
        <CardTitle className="text-xl text-forest-green">Support Companion</CardTitle>
        <CardDescription>
          I'm here to provide emotional support and answer questions about your recovery journey
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}>
              <div
                className={`flex ${message.role === "assistant" ? "flex-row" : "flex-row-reverse"} max-w-[80%] items-start gap-2`}
              >
                <Avatar
                  className={`h-8 w-8 ${message.role === "assistant" ? "bg-dusty-blue/20" : "bg-forest-green/20"}`}
                >
                  <AvatarFallback>
                    {message.role === "assistant" ? (
                      <Bot className="h-4 w-4 text-dusty-blue" />
                    ) : (
                      <User className="h-4 w-4 text-forest-green" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-lg px-4 py-2 ${
                    message.role === "assistant"
                      ? "bg-white border border-gray-200 text-gray-700"
                      : "bg-forest-green text-white"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex flex-row max-w-[80%] items-start gap-2">
                <Avatar className="h-8 w-8 bg-dusty-blue/20">
                  <AvatarFallback>
                    <Bot className="h-4 w-4 text-dusty-blue" />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-lg px-4 py-2 bg-white border border-gray-200">
                  <p className="text-sm">Typing...</p>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      <CardFooter className="border-t p-4">
        <form onSubmit={handleSendMessage} className="flex w-full gap-2">
          <Input
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow"
            disabled={isLoading}
          />
          <Button
            type="submit"
            size="icon"
            className="bg-forest-green hover:bg-forest-green/90"
            disabled={isLoading || input.trim() === ""}
          >
            <SendHorizontal className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
