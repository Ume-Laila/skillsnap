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

  const userPrompt = `Analyze this job description and return ONLY a valid JSON object with NO markdown, no backticks, no explanation.

The JSON must have exactly this structure:
{
  jobTitle: string,
  requiredSkills: [{ skill: string, category: string, difficulty: 'beginner'|'intermediate'|'advanced' }],
  likelyHaveSkills: [string],
  gapSkills: [string],
  roadmap: [
    {
      day: number,
      week: number,
      skill: string,
      task: string,
      resource: { title: string, url: string, type: 'video'|'article'|'docs' },
      interviewPhrase: string
    }
  ],
  summary: string,
  difficulty: 'entry'|'mid'|'senior'
}
Generate a realistic 30-day roadmap covering the gap skills.
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
            content:
              'You are SkillSnap AI. You must return ONLY a valid JSON object with NO markdown, no backticks, no explanation whatsoever.',
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
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

    try {
  // Try direct parse first
  return JSON.parse(content)
} catch {
  try {
    // Strip markdown backticks and retry
    const cleaned = content
      .replace(/```json/gi, '')
      .replace(/```/gi, '')
      .trim()
    return JSON.parse(cleaned)
  } catch {
    try {
      // Extract JSON object between first { and last }
      const start = content.indexOf('{')
      const end = content.lastIndexOf('}')
      if (start !== -1 && end !== -1) {
        return JSON.parse(content.slice(start, end + 1))
      }
      throw new Error('No JSON object found in response.')
    } catch {
      throw new Error('Failed to parse AI response as JSON. Please try again.')
    }
  }
}
  } catch (error) {
    const apiMessage = error?.response?.data?.error?.message
    throw new Error(`Job analysis failed: ${apiMessage || error?.message || 'Unknown error'}`)
  }
}

export { analyzeJob }
