
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
    const { dietary_goals, allergies, preferred_cuisines, activity_level } = await req.json()
    
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      console.error('OpenAI API key not configured')
      throw new Error('OpenAI API key not configured')
    }

    const prompt = `Create a personalized weekly meal plan for someone with these preferences:
    - Dietary goals: ${dietary_goals || 'General health'}
    - Allergies: ${allergies?.join(', ') || 'None'}
    - Preferred cuisines: ${preferred_cuisines?.join(', ') || 'Any'}
    - Activity level: ${activity_level || 'Moderate'}
    
    Please provide:
    1. 7 days of meals (breakfast, lunch, dinner, 2 snacks)
    2. Nutritional information for each meal
    3. A grocery shopping list organized by category
    4. Brief explanation of why this plan fits their goals
    
    Format the response as JSON with this structure:
    {
      "explanation": "Brief explanation",
      "meals": {
        "monday": {"breakfast": {"name": "...", "calories": 300, "protein": "15g"}, "lunch": {...}, "dinner": {...}, "snacks": [...]},
        "tuesday": {...},
        "wednesday": {...},
        "thursday": {...},
        "friday": {...},
        "saturday": {...},
        "sunday": {...}
      },
      "grocery_list": {
        "proteins": ["chicken breast", "salmon"],
        "vegetables": ["broccoli", "spinach"],
        "fruits": ["bananas", "apples"],
        "grains": ["brown rice", "quinoa"],
        "dairy": ["Greek yogurt", "milk"],
        "pantry": ["olive oil", "spices"]
      }
    }`

    console.log('Making request to OpenAI with prompt:', prompt.substring(0, 100) + '...')

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional nutritionist and meal planning expert. Create detailed, healthy, and practical meal plans. Always respond with valid JSON only.'
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

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, response.statusText)
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    console.log('OpenAI response received:', data.choices?.[0]?.message?.content?.substring(0, 100))

    let mealPlan
    try {
      mealPlan = JSON.parse(data.choices[0].message.content)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError)
      throw new Error('Failed to parse meal plan response')
    }

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
      JSON.stringify({ error: error.message || 'Failed to generate meal plan' }),
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
