const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/chat — Gemini AI lab assistant
router.post('/chat', async (req, res) => {
  try {
    const { messages, labContext } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Build system context
    let systemContext = `You are LabVerse AI Assistant — a friendly, knowledgeable science lab tutor for school and college students. You help students understand chemistry experiments, reactions, and safety in a virtual lab environment.

Guidelines:
- Be encouraging and educational
- Use simple language appropriate for the student's class level
- Include emojis occasionally to keep it fun 🧪
- Always emphasize safety when discussing dangerous reactions
- If asked about non-science topics, gently redirect to the lab
- Provide step-by-step explanations when asked about procedures`;

    if (labContext) {
      systemContext += `\n\nCurrent Lab State:
- Chemicals on bench: ${labContext.chemicals?.join(', ') || 'None'}
- Apparatus on bench: ${labContext.apparatus?.join(', ') || 'None'}
- Active reactions: ${labContext.reactions?.join(', ') || 'None'}
- Student class level: ${labContext.classLevel || 'Not specified'}`;
    }

    // Build conversation history for Gemini
    const chatHistory = messages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const chat = model.startChat({
      history: chatHistory.length > 0 ? chatHistory : undefined,
      systemInstruction: systemContext,
    });

    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const response = result.response.text();

    res.json({ response });
  } catch (error) {
    console.error('Gemini chat error:', error);
    res.status(500).json({ error: 'Failed to get AI response. Please check your API key.' });
  }
});

// POST /api/generate-experiment — Beta feature: Gemini generates experiment scaffold
router.post('/generate-experiment', async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'Experiment description is required' });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are an expert science curriculum designer. Based on the following student-submitted experiment idea, generate a complete interactive experiment scaffold in JSON format.

Student's Idea: "${description}"

Generate a JSON object with this structure:
{
  "title": "Experiment title",
  "description": "2-3 sentence description",
  "subject": "chemistry" or "physics" or "cs",
  "classLevel": [array of class numbers 6-12],
  "difficulty": "Beginner" or "Intermediate" or "Advanced",
  "tags": ["tag1", "tag2", ...],
  "materials": ["material1", "material2", ...],
  "procedure": [
    {"step": 1, "instruction": "Step description", "expectedResult": "What should happen"},
    ...
  ],
  "safetyWarnings": ["warning1", "warning2", ...],
  "learningObjectives": ["objective1", "objective2", ...],
  "theoryBackground": "2-3 paragraphs of theory",
  "funFacts": ["fact1", "fact2", ...]
}

Return ONLY the JSON, no markdown formatting or code blocks.`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();

    // Clean up potential markdown code blocks
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const experiment = JSON.parse(responseText);
    res.json(experiment);
  } catch (error) {
    console.error('Gemini generation error:', error);
    res.status(500).json({ error: 'Failed to generate experiment. Please try again.' });
  }
});

// POST /api/quiz — Gemini generates quiz based on lab activity
router.post('/quiz', async (req, res) => {
  try {
    const { labContext, classLevel } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Generate 5 multiple-choice quiz questions for a Class ${classLevel || 10} student based on these chemistry lab activities:

Chemicals used: ${labContext?.chemicals?.join(', ') || 'General chemistry'}
Reactions observed: ${labContext?.reactions?.join(', ') || 'General reactions'}

Return as a JSON array where each question has:
{
  "question": "Question text",
  "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
  "correctIndex": 0,
  "explanation": "Brief explanation of the correct answer"
}

Return ONLY the JSON array, no markdown.`;

    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    responseText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const quiz = JSON.parse(responseText);
    res.json(quiz);
  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({ error: 'Failed to generate quiz.' });
  }
});

module.exports = router;
