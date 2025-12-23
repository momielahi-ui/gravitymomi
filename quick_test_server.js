import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        console.log('Received message:', message);

        const result = await model.generateContent(message);
        const response = result.response.text();
        console.log('AI Response:', response);

        res.json({ success: true, response });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

const port = 3001;
app.listen(port, () => {
    console.log(`Test server running on http://localhost:${port}`);
    console.log('Send POST to /api/chat with { "message": "Hello" }');
});
