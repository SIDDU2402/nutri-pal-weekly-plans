
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import OnboardingFlow from "@/components/OnboardingFlow";
import Dashboard from "@/components/Dashboard";
import { Leaf, Heart, Calendar, ShoppingCart } from "lucide-react";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'welcome' | 'onboarding' | 'dashboard'>('welcome');
  const [userData, setUserData] = useState(null);

  const handleGetStarted = () => {
    setCurrentStep('onboarding');
  };

  const handleOnboardingComplete = (data: any) => {
    setUserData(data);
    setCurrentStep('dashboard');
  };

  if (currentStep === 'onboarding') {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  if (currentStep === 'dashboard') {
    return <Dashboard userData={userData} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-6">
            <div className="bg-green-100 p-3 rounded-full mr-3">
              <Leaf className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              NutriSenseAI
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Your caring AI wellness coach that understands your unique body, goals, and lifestyle to create personalized meal plans that make you feel amazing every day.
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg" 
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Start Your Wellness Journey
          </Button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-green-700">Personalized Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600">
                AI-powered meal plans tailored to your body, goals, and preferences
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-blue-700">Smart Grocery Lists</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600">
                Automatically generated shopping lists organized for easy store navigation
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-purple-700">Calendar Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600">
                Meal reminders and prep schedules synced with your Google Calendar
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Leaf className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-orange-700">Adaptive Learning</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600">
                Learns from your feedback to continuously improve recommendations
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Testimonial Preview */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg max-w-3xl mx-auto">
          <div className="text-center">
            <p className="text-lg text-gray-700 italic mb-4">
              "NutriSenseAI feels like having a caring nutritionist who truly understands me. The meal plans are delicious, and I love how it explains why each meal is perfect for my goals."
            </p>
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                S
              </div>
              <div>
                <p className="font-semibold text-gray-800">Sarah M.</p>
                <p className="text-sm text-gray-600">Lost 15 lbs in 2 months</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
