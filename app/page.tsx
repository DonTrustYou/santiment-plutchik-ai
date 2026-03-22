"use client";

import { useState, useEffect } from "react";
import {
  BrainCircuit,
  Send,
  BarChart3,
  History,
  Loader2,
  Sparkles,
} from "lucide-react";
import RadarVisual from "@/components/RadarVisual";

// 1. Дефинираме структурата на данните за TypeScript
interface EmotionData {
  subject: string;
  A: number;
}

export default function Home() {
  const [text, setText] = useState("");
  const [data, setData] = useState<EmotionData[] | null>(null);
  const [loading, setLoading] = useState(false);

  // 2. Състояние за избягване на Hydration грешката
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAnalyze = async () => {
    if (!text.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Грешка при анализа");
      }

      const result = await res.json();
      setData(result);
    } catch (error: unknown) {
      // Проверяваме дали грешката е инстанция на стандартния Error обект
      const errorMessage =
        error instanceof Error ? error.message : "Възникна неочаквана грешка";

      console.error("Грешка:", errorMessage);
      alert("Възникна проблем: " + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Ако компонентът още не е зареден в браузъра, не рендерираме нищо,
  // за да не се разминава със сървърния HTML
  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-slate-950 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex justify-between items-center border-b border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.4)]">
              <BrainCircuit size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                Plutchik<span className="text-indigo-500">Mind</span>
              </h1>
              <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">
                AI Emotion Engine
              </p>
            </div>
          </div>
          <div className="hidden md:block text-slate-400 text-sm font-mono bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
            GPT-4o Analysis Mode
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: INPUT */}
          <section className="lg:col-span-5 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-slate-400 flex items-center gap-2 font-semibold tracking-wide uppercase text-[10px]">
                  <Sparkles size={14} className="text-indigo-400" /> Текст за
                  анализ
                </label>
                <span className="text-[10px] font-mono text-slate-600 uppercase">
                  {text.length} символа
                </span>
              </div>

              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-80 bg-slate-950 border border-slate-800 rounded-xl p-4 text-slate-200 focus:ring-2 focus:ring-indigo-500 transition-all outline-none resize-none placeholder:text-slate-800 text-sm"
                placeholder="Поставете текст тук (на български или английски)..."
              />

              <button
                onClick={handleAnalyze}
                disabled={loading || !text.trim()}
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-900/20 active:scale-95"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    АНАЛИЗИРАНЕ...
                  </>
                ) : (
                  <>
                    <Send size={18} /> СТАРТИРАЙ
                  </>
                )}
              </button>
            </div>
          </section>

          {/* RIGHT: RESULTS */}
          <section className="lg:col-span-7 grid grid-cols-1 gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[400px] relative">
                <div className="absolute top-4 left-6">
                  <h3 className="text-indigo-400 font-bold text-[10px] uppercase tracking-widest">
                    Емоционално колело
                  </h3>
                </div>
                {data ? (
                  <RadarVisual emotionData={data} />
                ) : (
                  <div className="text-center space-y-3 opacity-30 group">
                    <BarChart3
                      className="mx-auto text-slate-600 group-hover:text-indigo-500 transition-colors"
                      size={64}
                    />
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">
                      Очаква се входни данни
                    </p>
                  </div>
                )}
              </div>

              {/* Bars View */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-inner">
                <h3 className="text-indigo-400 font-bold mb-8 text-[10px] uppercase tracking-widest">
                  Интензитет (%)
                </h3>
                <div className="space-y-5">
                  {(
                    data || [
                      { subject: "Joy", A: 0 },
                      { subject: "Trust", A: 0 },
                      { subject: "Fear", A: 0 },
                      { subject: "Surprise", A: 0 },
                      { subject: "Sadness", A: 0 },
                      { subject: "Disgust", A: 0 },
                      { subject: "Anger", A: 0 },
                      { subject: "Anticipation", A: 0 },
                    ]
                  ).map((item: EmotionData) => (
                    <div key={item.subject} className="space-y-1.5">
                      <div className="flex justify-between text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                        <span>{item.subject}</span>
                        <span className={item.A > 0 ? "text-indigo-400" : ""}>
                          {Math.round(item.A)}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-950 border border-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-indigo-800 via-indigo-500 to-indigo-400 h-full transition-all duration-1000 ease-in-out"
                          style={{ width: `${item.A}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Timeline Placeholder */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-32 flex items-center justify-center group border-dashed hover:border-indigo-500/50 transition-all cursor-default overflow-hidden">
              <div className="flex flex-col items-center text-slate-700 group-hover:text-indigo-400 transition-colors">
                <History
                  size={24}
                  className="mb-2 opacity-20 group-hover:rotate-[-45deg] transition-transform duration-500"
                />
                <p className="text-[10px] uppercase tracking-[0.3em] font-black italic">
                  History Log: Feature coming soon
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
