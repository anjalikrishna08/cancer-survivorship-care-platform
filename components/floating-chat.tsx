"use client"

import { useState, useRef, useEffect, FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MessageSquare, X, SendHorizontal, Bot, User, Minimize2 } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
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
    if (isOpen && !isMinimized) {
      scrollToBottom()
    }
  }, [messages, isOpen, isMinimized])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
    setIsMinimized(false)
  }

  const minimizeChat = () => {
    setIsMinimized(!isMinimized)
  }

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault()
    if (input.trim() === "") return

    const userMessage: Message = {
      role: "user",
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response from AI')
      }
      
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
        },
      ])
    } catch (error: any) {
      console.error("Error in chat:", error)
      let errorMessage = "I'm sorry, I encountered an error. Please try again later."
      
      if (error.message?.includes('quota') || error.message?.includes('billing')) {
        errorMessage = "I'm currently unable to respond due to API quota limitations. Please try again later or contact support for assistance."
      }
      
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorMessage,
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <Card
          className={`border-none shadow-lg mb-4 transition-all duration-300 ease-in-out ${
            isMinimized ? "w-[300px] h-[60px] overflow-hidden" : "w-[350px] sm:w-[400px] h-[500px] flex flex-col"
          }`}
        >
          <CardHeader className="bg-forest-green text-white p-3 flex flex-row justify-between items-center rounded-t-lg">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 bg-white/10">
                <AvatarFallback className="text-white">
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg font-medium">Support Companion</CardTitle>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white hover:bg-white/10 rounded-full"
                onClick={minimizeChat}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-white hover:bg-white/10 rounded-full"
                onClick={toggleChat}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {!isMinimized && (
            <>
              <CardContent className="flex-grow overflow-y-auto p-4 bg-white">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
                    >
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
                              ? "bg-gray-100 border border-gray-200 text-gray-700"
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
                        <div className="rounded-lg px-4 py-2 bg-gray-100 border border-gray-200">
                          <p className="text-sm">Typing...</p>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              <CardFooter className="border-t p-3 bg-white">
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
            </>
          )}
        </Card>
      )}

      <Button
        onClick={toggleChat}
        className="rounded-full h-14 w-14 bg-forest-green hover:bg-forest-green/90 shadow-lg flex items-center justify-center"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    </div>
  )
}
