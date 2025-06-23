
import { useAuth } from "@/contexts/AuthContext";
import { useUserData } from "@/hooks/useUserData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import OnboardingFlow from "@/components/OnboardingFlow";
import RealTimeDashboard from "@/components/RealTimeDashboard";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Leaf, Heart, Calendar, ShoppingCart, Brain, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  const { user, loading } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useUserData();

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated but hasn't completed onboarding
  if (user && (!profile?.age || !profile?.weight || !profile?.height || !profile?.dietary_goals)) {
    const handleOnboardingComplete = async (data: any) => {
      try {
        await updateProfile({
          first_name: data.basicInfo.name,
          age: parseInt(data.basicInfo.age),
          gender: data.basicInfo.gender,
          weight: parseFloat(data.basicInfo.weight),
          height: parseFloat(data.basicInfo.height),
          dietary_goals: data.goals.primaryGoal,
          activity_level: data.lifestyle.activityLevel,
          allergies: data.dietary.allergies,
          preferred_cuisines: data.dietary.cuisines
        });
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    };

    return (
      <ProtectedRoute>
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      </ProtectedRoute>
    );
  }

  // If user is authenticated and has completed onboarding, show dashboard
  if (user && profile?.age) {
    return (
      <ProtectedRoute>
        <RealTimeDashboard />
      </ProtectedRoute>
    );
  }

  // Landing page for non-authenticated users
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
          <div className="flex gap-4 justify-center">
            <Link to="/auth">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Start Your Wellness Journey
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-green-700">Personalized Plans</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600">
                AI-powered meal plans tailored to your body, goals, and preferences with real-time updates
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
                Automatically generated shopping lists organized for easy store navigation using Spoonacular API
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-purple-700">AI Nutritionist Chat</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600">
                Chat with your personal AI nutritionist powered by OpenAI for instant guidance and support
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-orange-700">Real-Time Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600">
                Your dashboard updates in real-time as you track progress and receive new recommendations
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-green-700">Recipe Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600">
                Get detailed recipes and cooking instructions integrated with Spoonacular's recipe database
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Leaf className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-blue-700">Health Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-gray-600">
                Track your daily steps, sleep, mood, and see how they impact your nutrition recommendations
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Testimonial Preview */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg max-w-3xl mx-auto">
          <div className="text-center">
            <p className="text-lg text-gray-700 italic mb-4">
              "NutriSenseAI feels like having a caring nutritionist who truly understands me. The real-time updates and AI chat feature make it feel so personal and responsive to my needs."
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
