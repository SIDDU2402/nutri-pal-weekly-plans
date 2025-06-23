
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { dietary_goals, allergies, preferred_cuisines, activity_level } = await req.json()
    
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const prompt = `Create a personalized weekly meal plan for someone with these preferences:
    - Dietary goals: ${dietary_goals}
    - Allergies: ${allergies?.join(', ') || 'None'}
    - Preferred cuisines: ${preferred_cuisines?.join(', ') || 'Any'}
    - Activity level: ${activity_level}
    
    Please provide:
    1. 7 days of meals (breakfast, lunch, dinner, 2 snacks)
    2. Nutritional information for each meal
    3. A grocery shopping list organized by category
    4. Brief explanation of why this plan fits their goals
    
    Format the response as JSON with this structure:
    {
      "explanation": "Brief explanation",
      "meals": {
        "monday": {"breakfast": {...}, "lunch": {...}, "dinner": {...}, "snacks": [...]},
        // ... for all 7 days
      },
      "grocery_list": {
        "proteins": [...],
        "vegetables": [...],
        "fruits": [...],
        "grains": [...],
        "dairy": [...],
        "pantry": [...]
      }
    }`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional nutritionist and meal planning expert. Create detailed, healthy, and practical meal plans.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
      }),
    })

    const data = await response.json()
    const mealPlan = JSON.parse(data.choices[0].message.content)

    return new Response(
      JSON.stringify({ mealPlan }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        } 
      },
    )
  } catch (error) {
    console.error('Error generating meal plan:', error)
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
