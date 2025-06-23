
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { ingredients, dietary_restrictions, cuisine_type, meal_type } = await req.json()
    
    const spoonacularApiKey = Deno.env.get('SPOONACULAR_API_KEY')
    if (!spoonacularApiKey) {
      throw new Error('Spoonacular API key not configured')
    }

    const params = new URLSearchParams({
      apiKey: spoonacularApiKey,
      includeIngredients: ingredients?.join(',') || '',
      diet: dietary_restrictions || '',
      cuisine: cuisine_type || '',
      type: meal_type || '',
      number: '12',
      addRecipeInformation: 'true',
      fillIngredients: 'true'
    })

    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?${params}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    const data = await response.json()

    // Get detailed recipe information for the first few results
    const detailedRecipes = await Promise.all(
      data.results.slice(0, 6).map(async (recipe: any) => {
        const detailResponse = await fetch(
          `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${spoonacularApiKey}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        return await detailResponse.json()
      })
    )

    return new Response(
      JSON.stringify({ recipes: detailedRecipes }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        } 
      },
    )
  } catch (error) {
    console.error('Error fetching recipes:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        }
      },
    )
  }
})
