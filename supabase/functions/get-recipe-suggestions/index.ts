
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
      console.error('Spoonacular API key not configured')
      throw new Error('Spoonacular API key not configured')
    }

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      throw new Error('Ingredients array is required and must not be empty')
    }

    const params = new URLSearchParams({
      apiKey: spoonacularApiKey,
      includeIngredients: ingredients.join(','),
      diet: dietary_restrictions || '',
      cuisine: cuisine_type || '',
      type: meal_type || '',
      number: '12',
      addRecipeInformation: 'true',
      fillIngredients: 'true'
    })

    console.log('Making request to Spoonacular API with ingredients:', ingredients.join(', '))

    const response = await fetch(
      `https://api.spoonacular.com/recipes/complexSearch?${params}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!response.ok) {
      console.error('Spoonacular API error:', response.status, response.statusText)
      throw new Error(`Spoonacular API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.results || !Array.isArray(data.results)) {
      console.log('No recipes found for the given ingredients')
      return new Response(
        JSON.stringify({ recipes: [] }),
        { 
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json',
          } 
        },
      )
    }

    console.log(`Found ${data.results.length} recipes, getting detailed information for top 6`)

    // Get detailed recipe information for the first few results
    const detailedRecipes = await Promise.all(
      data.results.slice(0, 6).map(async (recipe: any) => {
        try {
          const detailResponse = await fetch(
            `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${spoonacularApiKey}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          )
          
          if (detailResponse.ok) {
            return await detailResponse.json()
          } else {
            console.warn(`Failed to get details for recipe ${recipe.id}`)
            return recipe // Return basic recipe if detailed fetch fails
          }
        } catch (error) {
          console.warn(`Error fetching details for recipe ${recipe.id}:`, error)
          return recipe // Return basic recipe if detailed fetch fails
        }
      })
    )

    console.log(`Successfully processed ${detailedRecipes.length} recipes`)

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
      JSON.stringify({ error: error.message || 'Failed to fetch recipes' }),
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
