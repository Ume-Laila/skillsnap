import axios from 'axios'

async function analyzeJob(jobDescription) {
  if (!jobDescription?.trim()) {
    throw new Error('Job description is required for analysis.')
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('Gemini API key is missing. Please set VITE_GEMINI_API_KEY in .env.')
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

  const prompt = `You are SkillSnap AI. Analyze this job description and return ONLY a 
valid JSON object with NO markdown, no backticks, no explanation. 
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
For resources use only real free URLs from: youtube.com, freecodecamp.org, 
developer.mozilla.org, docs.python.org, reactjs.org, tailwindcss.com, 
w3schools.com, javascript.info

Job Description:
${jobDescription}`

  try {
    const response = await axios.post(url, {
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
    })

    const rawText =
      response?.data?.candidates?.[0]?.content?.parts?.find((part) => typeof part.text === 'string')?.text || ''

    if (!rawText) {
      throw new Error('Gemini returned an empty response.')
    }

    try {
      return JSON.parse(rawText)
    } catch {
      const cleaned = rawText.replace(/```json|```/gi, '').trim()
      return JSON.parse(cleaned)
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse Gemini response as JSON.')
    }

    const apiMessage = error?.response?.data?.error?.message
    throw new Error(`Job analysis failed: ${apiMessage || error?.message || 'Unknown error'}`)
  }
}

export { analyzeJob }
