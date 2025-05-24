import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, Heart, Shield, MessageSquare, ClipboardList } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-parchment">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-dusty-blue/20 to-parchment">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-forest-green mb-6">
              AI-Powered Cancer Survivorship Care
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-8">
              Personalized support for your journey beyond cancer treatment
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-forest-green hover:bg-forest-green/90 text-white px-8 py-6 text-lg" asChild>
                <Link href="/auth/login">
                  Sign In <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="border-dusty-blue text-dusty-blue hover:bg-dusty-blue/10 px-8 py-6 text-lg"
                asChild
              >
                <Link href="/auth/register">Create Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-forest-green mb-12">
            Personalized Support Throughout Your Journey
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<ClipboardList className="h-10 w-10 text-dusty-blue" />}
              title="Comprehensive Health Survey"
              description="Share your treatment history, physical activity, emotional health, and lifestyle factors to receive personalized care recommendations."
            />

            <FeatureCard
              icon={<Heart className="h-10 w-10 text-mist-green" />}
              title="AI-Generated Care Plans"
              description="Receive customized recommendations for managing your post-treatment recovery, including lifestyle adjustments and follow-up care."
            />

            <FeatureCard
              icon={<MessageSquare className="h-10 w-10 text-dusty-blue" />}
              title="Supportive AI Chatbot"
              description="Access our interactive chatbot for immediate emotional support and answers to your questions, available 24/7."
            />

            <FeatureCard
              icon={<Shield className="h-10 w-10 text-forest-green" />}
              title="Privacy & Security"
              description="Your data is protected with enterprise-grade security measures and full compliance with healthcare regulations."
            />

            <FeatureCard
              icon={<Heart className="h-10 w-10 text-mist-green" />}
              title="Resource Connection"
              description="Connect with support groups, educational resources, and healthcare providers tailored to your specific needs."
            />

            <FeatureCard
              icon={<ClipboardList className="h-10 w-10 text-dusty-blue" />}
              title="Progress Tracking"
              description="Monitor your recovery journey with easy-to-understand visualizations and milestone tracking."
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-mist-green/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-forest-green mb-12">Stories from Survivors</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TestimonialCard
              quote="This platform gave me the guidance I needed when I felt lost after completing my treatment. The personalized recommendations helped me regain control of my health."
              author="Sarah M., Breast Cancer Survivor"
            />

            <TestimonialCard
              quote="The chatbot became my midnight companion when anxiety struck. Having 24/7 support made a world of difference in my emotional recovery."
              author="James L., Prostate Cancer Survivor"
            />

            <TestimonialCard
              quote="I appreciate how the system adapts to my changing needs. As I progress in my recovery, the recommendations evolve with me."
              author="Elena K., Lymphoma Survivor"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-dusty-blue/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-forest-green mb-6">Begin Your Personalized Care Journey Today</h2>
          <p className="text-lg text-gray-700 mb-8">
            Take the first step toward a supported recovery with guidance tailored specifically to your needs.
          </p>
          <Button className="bg-forest-green hover:bg-forest-green/90 text-white px-8 py-6 text-lg" asChild>
            <Link href="/auth/register">
              Create Your Account <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-center mb-4">{icon}</div>
        <CardTitle className="text-xl text-center text-forest-green">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-center text-gray-600">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

function TestimonialCard({ quote, author }) {
  return (
    <Card className="border-none shadow-md bg-white">
      <CardContent className="pt-6">
        <p className="text-gray-700 italic mb-4">"{quote}"</p>
        <p className="text-forest-green font-medium">— {author}</p>
      </CardContent>
    </Card>
  )
}
