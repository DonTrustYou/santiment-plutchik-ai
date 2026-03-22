import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            'Analyze the following text and return a JSON object with 8 Plutchik emotions (Joy, Trust, Fear, Surprise, Sadness, Disgust, Anger, Anticipation) on a scale 0-100. Format: { "Joy": 10, ... }',
        },
        { role: "user", content: text },
      ],
      response_format: { type: "json_object" },
    });

    const data = JSON.parse(response.choices[0].message.content || "{}");

    // Преобразуваме данните за RadarChart формата ни
    const formattedData = Object.entries(data).map(([key, value]) => ({
      subject: key,
      A: value,
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    return NextResponse.json({ error: "API Error" }, { status: 500 });
  }
}
