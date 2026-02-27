const axios = require('axios');

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant';

const callGroq = async (systemPrompt, userMessage) => {
  try {
    const res = await axios.post(
      GROQ_URL,
      {
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 1024
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return res.data.choices[0].message.content;
  } catch (err) {
    console.error('Groq API error:', err.response?.data || err.message);
    throw new Error(err.response?.data?.error?.message || 'Groq API call failed');
  }
};

// Clean and parse JSON from AI response (handles markdown code blocks)
const parseJSON = (raw) => {
  try {
    let cleaned = raw
      .replace(/```json\s*/gi, '')
      .replace(/```\s*/gi, '')
      .trim();

    const start = cleaned.indexOf('[');
    const end = cleaned.lastIndexOf(']');
    if (start !== -1 && end !== -1) {
      cleaned = cleaned.slice(start, end + 1);
    }

    return JSON.parse(cleaned);
  } catch (err) {
    console.error('JSON parse error. Raw response:', raw);
    throw new Error('AI returned invalid format. Please try again.');
  }
};

// 1. Doubt Solver
exports.solveDoubt = async (question) => {
  const system = `You are a friendly, expert tutor for college students.
Explain concepts clearly, step-by-step. Use simple language and examples.
Avoid jargon unless necessary. If it's a math/code problem, show full working.`;
  return await callGroq(system, question);
};

// 2. Quiz Generator (UPDATED SYSTEM PROMPT)
exports.generateQuiz = async (topic, difficulty, numQuestions = 5) => {
  const system = `You are a quiz generator. Return ONLY a valid JSON array with no extra text.
Each item must have exactly this format:
{ "question": "What is 2+2?", "options": ["1", "2", "4", "8"], "correctAnswer": "4" }
The options must be the FULL answer text, NOT letters like A/B/C/D.
The correctAnswer must be the exact full text of the correct option.
Do not include markdown, backticks, or any explanation.`;

  const prompt = `Generate ${numQuestions} ${difficulty}-level multiple choice questions on the topic: ${topic}.
Return ONLY the JSON array.`;

  console.log(`Generating quiz for topic: ${topic}, difficulty: ${difficulty}`);
  const raw = await callGroq(system, prompt);
  console.log('Raw AI response:', raw.substring(0, 200));

  return parseJSON(raw);
};

// 3. Study Plan Generator
exports.generateStudyPlan = async (weakTopics, learningGoal) => {
  const system = `You are a personalized academic coach.
Create a detailed 7-day study plan. Format it day by day.
Be specific with topics, time allocations, and resources.`;

  const prompt = `Student goal: ${learningGoal}
Weak topics: ${weakTopics.join(', ')}
Create a structured 7-day recovery study plan.`;

  return await callGroq(system, prompt);
};

// 4. Topic Explainer
exports.explainTopic = async (topic) => {
  const system = `You are a professor. Give a clear, structured explanation of any topic.
Include: definition, key concepts, real-world examples, and a quick summary.`;

  return await callGroq(system, `Explain: ${topic}`);
};