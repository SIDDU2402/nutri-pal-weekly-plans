
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { useUserData } from '@/hooks/useUserData';
import { CalendarDays, ShoppingCart, Target, TrendingUp, User, LogOut } from "lucide-react";
import AiMealPlanGenerator from './AiMealPlanGenerator';
import RecipeSuggestions from './RecipeSuggestions';
import AiNutritionistChat from './AiNutritionistChat';
import HealthDataTracker from './HealthDataTracker';

const RealTimeDashboard = () => {
  const { user, signOut } = useAuth();
  const { profile, healthData, mealPlans, loading } = useUserData();

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const todayHealthData = healthData?.[0];
  const currentMealPlan = mealPlans?.[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome back, {profile?.first_name || 'there'}! 🌱
            </h1>
            <p className="text-gray-600">
              Here's your personalized wellness dashboard with real-time updates.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-600">{user?.email}</span>
            </div>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Today's Steps
              </CardTitle>
              <Target className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">
                {todayHealthData?.steps || 0}
              </div>
              <p className="text-xs text-gray-500">
                Daily goal: 10,000
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Sleep Hours
              </CardTitle>
              <CalendarDays className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">
                {todayHealthData?.sleep_hours || 0}h
              </div>
              <p className="text-xs text-gray-500">
                Target: 8 hours
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Mood Score
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">
                {todayHealthData?.mood || '-'}/10
              </div>
              <p className="text-xs text-gray-500">
                Daily tracking
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Meal Plans
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700">
                {mealPlans?.length || 0}
              </div>
              <p className="text-xs text-gray-500">
                Generated plans
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Profile Information</CardTitle>
                <CardDescription>
                  Your personal details for AI-powered recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Name</p>
                    <p className="text-lg">
                      {profile?.first_name && profile?.last_name 
                        ? `${profile.first_name} ${profile.last_name}` 
                        : 'Not set'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Age</p>
                    <p className="text-lg">{profile?.age || 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Weight</p>
                    <p className="text-lg">{profile?.weight ? `${profile.weight} lbs` : 'Not set'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Height</p>
                    <p className="text-lg">{profile?.height ? `${profile.height} inches` : 'Not set'}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Dietary Goals</p>
                  <p className="text-lg">{profile?.dietary_goals || 'Not set'}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Activity Level</p>
                  <p className="text-lg">{profile?.activity_level || 'Not set'}</p>
                </div>

                {profile?.allergies && profile.allergies.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Allergies</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.allergies.map((allergy, index) => (
                        <Badge key={index} variant="secondary">{allergy}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {profile?.preferred_cuisines && profile.preferred_cuisines.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">Preferred Cuisines</p>
                    <div className="flex flex-wrap gap-2">
                      {profile.preferred_cuisines.map((cuisine, index) => (
                        <Badge key={index} variant="outline">{cuisine}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Health Data Tracker */}
            <HealthDataTracker />

            {/* Recipe Suggestions */}
            <RecipeSuggestions />
          </div>

          {/* AI Features Sidebar */}
          <div className="space-y-6">
            {/* AI Meal Plan Generator */}
            <AiMealPlanGenerator />

            {/* AI Nutritionist Chat */}
            <AiNutritionistChat />

            {/* Recent Health Data */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {healthData && healthData.length > 0 ? (
                    healthData.slice(0, 5).map((data) => (
                      <div key={data.id} className="flex justify-between text-sm">
                        <span className="text-gray-600">{data.date}</span>
                        <div className="text-right">
                          <div>Steps: {data.steps || 0}</div>
                          <div>Sleep: {data.sleep_hours || 0}h</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-500 text-center">
                      No health data recorded yet
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeDashboard;
