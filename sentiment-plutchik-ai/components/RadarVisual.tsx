"use client"; // Важно за интерактивни графики в Next.js

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from "recharts";

const data = [
  { subject: "Joy", A: 0 },
  { subject: "Trust", A: 0 },
  { subject: "Fear", A: 0 },
  { subject: "Surprise", A: 0 },
  { subject: "Sadness", A: 0 },
  { subject: "Disgust", A: 0 },
  { subject: "Anger", A: 0 },
  { subject: "Anticipation", A: 0 },
];

export default function RadarVisual({ emotionData = data }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[400px]">
      <h3 className="text-indigo-400 font-semibold mb-4 text-sm uppercase">
        Емоционален профил
      </h3>
      <RadarVisual />
    </div>
  );
}
