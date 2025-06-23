
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, ShoppingCart, Target, TrendingUp } from "lucide-react";

interface DashboardProps {
  userData: any;
}

const Dashboard = ({ userData }: DashboardProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back! 🌱
          </h1>
          <p className="text-gray-600">
            Let's continue your wellness journey with personalized nutrition guidance.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Current Goal
              </CardTitle>
              <Target className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">Weight Loss</div>
              <p className="text-xs text-gray-500">
                Progress tracking active
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                This Week
              </CardTitle>
              <CalendarDays className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-700">5/7</div>
              <p className="text-xs text-gray-500">
                Meal plans followed
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Grocery List
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-700">12</div>
              <p className="text-xs text-gray-500">
                Items remaining
              </p>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Progress
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-700">+2.3%</div>
              <p className="text-xs text-gray-500">
                From last week
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Today's Meals */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800">Today's Meal Plan</CardTitle>
                <CardDescription>
                  Personalized recommendations based on your goals
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-green-800">Breakfast</h3>
                    <Badge variant="secondary">520 cal</Badge>
                  </div>
                  <p className="text-sm text-green-700 mb-2">
                    Greek Yogurt Bowl with Berries & Almonds
                  </p>
                  <p className="text-xs text-green-600">
                    Perfect protein start to fuel your morning! The probiotics support digestion while antioxidants boost immunity.
                  </p>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-blue-800">Lunch</h3>
                    <Badge variant="secondary">420 cal</Badge>
                  </div>
                  <p className="text-sm text-blue-700 mb-2">
                    Quinoa Power Bowl with Grilled Chicken
                  </p>
                  <p className="text-xs text-blue-600">
                    This balanced combo provides sustained energy and helps with muscle recovery after your workout.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-purple-800">Dinner</h3>
                    <Badge variant="secondary">380 cal</Badge>
                  </div>
                  <p className="text-sm text-purple-700 mb-2">
                    Baked Salmon with Roasted Vegetables
                  </p>
                  <p className="text-xs text-purple-600">
                    Omega-3 rich salmon supports heart health while fiber-packed veggies aid digestion for better sleep.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                  Generate New Meal Plan
                </Button>
                <Button variant="outline" className="w-full">
                  Update Grocery List
                </Button>
                <Button variant="outline" className="w-full">
                  Schedule Meals
                </Button>
              </CardContent>
            </Card>

            {/* Weekly Progress */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800">This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Calories Target</span>
                    <span className="font-medium">1,400 / day</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Protein Goal</span>
                    <span className="font-medium">120g / day</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Water Intake</span>
                    <span className="font-medium">2.5L / day</span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500">
                      You're doing great! Keep up the consistent progress.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
