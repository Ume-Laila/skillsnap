import axios from 'axios'

async function analyzeJob(jobDescription) {
  if (!jobDescription?.trim()) {
    throw new Error('Job description is required for analysis.')
  }

  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY

  if (!apiKey) {
    throw new Error('OpenRouter API key is missing. Please set VITE_OPENROUTER_API_KEY in .env.')
  }

  const url = 'https://openrouter.ai/api/v1/chat/completions'

  const userPrompt = `Analyze this job description.

CRITICAL: Your entire response must be ONLY a JSON object. Start with { and end with }. No markdown. No backticks. No explanation. No text outside the JSON. Use double quotes for all keys and values.

Required JSON structure:
{
  "jobTitle": "string",
  "requiredSkills": [{"skill": "string", "category": "string", "difficulty": "beginner"}],
  "likelyHaveSkills": ["string"],
  "gapSkills": ["string"],
  "roadmap": [
    {
      "day": 1,
      "week": 1,
      "skill": "string",
      "task": "string",
      "resource": {"title": "string", "url": "string", "type": "video"},
      "interviewPhrase": "string"
    }
  ],
  "summary": "string",
  "difficulty": "entry"
}

Generate exactly 30 roadmap items (day 1 to day 30, week 1 to 4).
Resources must be real free URLs from: youtube.com, freecodecamp.org, developer.mozilla.org, reactjs.org, tailwindcss.com, javascript.info

Job Description:
${jobDescription}`

  try {
    const response = await axios.post(
      url,
      {
        model: 'openai/gpt-oss-120b:free',
        messages: [
          {
            role: 'system',
            content: 'You are SkillSnap AI. Return ONLY a raw JSON object. No markdown, no backticks, no explanation. Start with { and end with }.',
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 4000,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5173',
          'X-Title': 'SkillSnap',
        },
      },
    )

    const content = response?.data?.choices?.[0]?.message?.content

    if (!content || typeof content !== 'string') {
      throw new Error('OpenRouter returned an empty response.')
    }

    // Try direct parse
    try {
      return JSON.parse(content)
    } catch {
      // Strip markdown backticks
      try {
        const cleaned = content
          .replace(/```json/gi, '')
          .replace(/```/gi, '')
          .trim()
        return JSON.parse(cleaned)
      } catch {
        // Extract between first { and last }
        const start = content.indexOf('{')
        const end = content.lastIndexOf('}')
        if (start !== -1 && end !== -1) {
          try {
            return JSON.parse(content.slice(start, end + 1))
          } catch {
            throw new Error('Failed to parse AI response as JSON. Please try again.')
          }
        }
        throw new Error('Failed to parse AI response as JSON. Please try again.')
      }
    }
  } catch (error) {
    if (error.message.includes('Failed to parse') || error.message.includes('JSON')) {
      throw error
    }
    const apiMessage = error?.response?.data?.error?.message
    throw new Error(`Job analysis failed: ${apiMessage || error?.message || 'Unknown error'}`)
  }
}

export { analyzeJob }