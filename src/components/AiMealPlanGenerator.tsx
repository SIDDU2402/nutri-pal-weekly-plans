
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserData } from '@/hooks/useUserData';
import { Loader2, CalendarDays } from 'lucide-react';

const AiMealPlanGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { user } = useAuth();
  const { profile } = useUserData();
  const { toast } = useToast();

  const generateMealPlan = async () => {
    if (!user || !profile) {
      toast({
        title: "Error",
        description: "Please complete your profile first",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-meal-plan', {
        body: {
          dietary_goals: profile.dietary_goals,
          allergies: profile.allergies,
          preferred_cuisines: profile.preferred_cuisines,
          activity_level: profile.activity_level
        }
      });

      if (error) throw error;

      // Save the meal plan to the database
      const weekStartDate = new Date();
      weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay());

      const { error: saveError } = await supabase
        .from('meal_plans')
        .insert({
          user_id: user.id,
          week_start_date: weekStartDate.toISOString().split('T')[0],
          meals: data.mealPlan.meals,
          grocery_list: data.mealPlan.grocery_list
        });

      if (saveError) throw saveError;

      toast({
        title: "🎉 Meal Plan Generated!",
        description: "Your personalized weekly meal plan is ready!"
      });
    } catch (error) {
      console.error('Error generating meal plan:', error);
      toast({
        title: "Error",
        description: "Failed to generate meal plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-green-600" />
          AI Meal Plan Generator
        </CardTitle>
        <CardDescription>
          Generate a personalized weekly meal plan based on your preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={generateMealPlan}
          disabled={isGenerating}
          className="w-full bg-green-500 hover:bg-green-600 text-white"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate AI Meal Plan'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AiMealPlanGenerator;
