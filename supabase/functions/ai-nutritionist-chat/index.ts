
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
    const { message, user_context } = await req.json()
    
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      console.error('OpenAI API key not configured')
      throw new Error('OpenAI API key not configured')
    }

    if (!message || typeof message !== 'string') {
      throw new Error('Message is required and must be a string')
    }

    const systemPrompt = `You are NutriSenseAI, a caring and knowledgeable AI nutritionist. You provide personalized nutrition advice, meal planning help, and wellness guidance.

User Context:
- Dietary Goals: ${user_context?.dietary_goals || 'Not specified'}
- Allergies: ${user_context?.allergies?.join(', ') || 'None'}
- Activity Level: ${user_context?.activity_level || 'Not specified'}
- Age: ${user_context?.age || 'Not specified'}
- Weight: ${user_context?.weight || 'Not specified'}
- Height: ${user_context?.height || 'Not specified'}

Guidelines:
- Be encouraging and supportive
- Provide practical, actionable advice
- Consider the user's specific context and restrictions
- Ask clarifying questions when needed
- Always prioritize safety and recommend consulting healthcare providers for medical issues
- Keep responses conversational but informative
- Limit responses to 150-200 words for better readability`

    console.log('Processing chat message:', message.substring(0, 50) + '...')

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
            content: systemPrompt
          },
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    })

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, response.statusText)
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const aiResponse = data.choices?.[0]?.message?.content

    if (!aiResponse) {
      throw new Error('No response received from OpenAI')
    }

    console.log('AI response generated successfully')

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json',
        } 
      },
    )
  } catch (error) {
    console.error('Error in AI chat:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to process chat message' }),
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
