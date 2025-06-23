
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useUserData } from '@/hooks/useUserData';
import { Loader2, ChefHat, Clock, Users } from 'lucide-react';

interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
}

const RecipeSuggestions = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const { profile } = useUserData();
  const { toast } = useToast();

  const getRecipeSuggestions = async () => {
    if (!ingredients.trim()) {
      toast({
        title: "Please enter ingredients",
        description: "Add some ingredients to get recipe suggestions",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('get-recipe-suggestions', {
        body: {
          ingredients: ingredients.split(',').map(i => i.trim()),
          dietary_restrictions: profile?.allergies?.join(','),
          cuisine_type: profile?.preferred_cuisines?.[0],
          meal_type: 'main course'
        }
      });

      if (error) throw error;

      setRecipes(data.recipes);
      toast({
        title: "🍳 Recipes Found!",
        description: `Found ${data.recipes.length} delicious recipes for you!`
      });
    } catch (error) {
      console.error('Error getting recipe suggestions:', error);
      toast({
        title: "Error",
        description: "Failed to get recipe suggestions. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-orange-600" />
            Recipe Suggestions
          </CardTitle>
          <CardDescription>
            Get personalized recipes based on ingredients you have
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="ingredients">Available Ingredients</Label>
            <Input
              id="ingredients"
              placeholder="e.g., chicken, rice, broccoli, garlic"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button 
            onClick={getRecipeSuggestions}
            disabled={isLoading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Finding Recipes...
              </>
            ) : (
              'Get Recipe Suggestions'
            )}
          </Button>
        </CardContent>
      </Card>

      {recipes.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          {recipes.map((recipe) => (
            <Card key={recipe.id} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <img 
                  src={recipe.image} 
                  alt={recipe.title}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <CardTitle className="text-lg">{recipe.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {recipe.readyInMinutes} min
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {recipe.servings} servings
                  </div>
                </div>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {recipe.summary?.replace(/<[^>]*>/g, '') || 'Delicious recipe tailored to your preferences'}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipeSuggestions;
