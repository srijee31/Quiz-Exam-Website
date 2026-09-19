import { useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useLocation } from "wouter";
import {
  ArrowLeft, ArrowRight, BarChart3, BookOpen, Check, ChevronRight, Clock3, Download, FileText,
  Flag, GraduationCap, LayoutDashboard, LockKeyhole, LogOut, Menu, RotateCcw, Search, ShieldCheck,
  Sparkles, Upload, Users, Zap,
} from "lucide-react";
import { sampleQuestions, subjects, type Option, type PracticeQuestion, type Subject } from "@/data/questions";

type Screen = "home" | "quiz" | "result" | "admin-login" | "admin";
type AttemptRecord = {
  id: string;
  candidateName: string;
  candidateEmail: string;
  date: string;
  quizSize: number;
  score: number;
  accuracy: number;
  timeTaken: string;
  questions: PracticeQuestion[];
  answers: Record<number, Option | undefined>;
};

const sizes = [25, 50, 75, 100];
const optionLetters: Option[] = ["A", "B", "C", "D"];
const optionColors: Record<Option, string> = {
  A: "bg-[#e9f2ed] text-[#285842]",
  B: "bg-[#f4ebdd] text-[#765020]",
  C: "bg-[#e9edf3] text-[#244d70]",
  D: "bg-[#f6e9e5] text-[#934536]",
};

function shuffle<T>(items: T[]) { return [...items].sort(() => Math.random() - 0.5); }
function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = Math.max(0, totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}
function buildQuiz(size: number) {
  const result: PracticeQuestion[] = [];
  let pool = shuffle(sampleQuestions);
  while (result.length < size) {
    if (!pool.length) pool = shuffle(sampleQuestions);
    result.push(pool.shift()!);
  }
  return result;
}

function Brand() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#d08b24] text-[#173b5c]"><GraduationCap className="h-5 w-5" /></div>
      <div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#d08b24]">Karnataka exam prep</p><p className="font-serif text-lg font-bold leading-tight text-white">VAO Practice Desk</p></div>
    </div>
  );
}

function PublicHeader({ onAdmin }: { onAdmin: () => void }) {
  return (
    <header className="border-b border-[#315776] bg-[#173b5c] text-white">
      <div className="container flex h-[74px] items-center justify-between">
        <Brand />
        <nav className="hidden items-center gap-7 text-sm font-medium text-[#dbe6ec] md:flex">
          <a href="#how-it-works" className="hover:text-white">How it works</a>
          <a href="#subjects" className="hover:text-white">Subjects</a>
          <button onClick={onAdmin} className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 hover:border-[#d08b24] hover:text-[#f7d797]"><LockKeyhole className="h-3.5 w-3.5" /> Admin access</button>
        </nav>
        <button onClick={onAdmin} className="rounded-lg p-2 text-[#dbe6ec] md:hidden" aria-label="Open admin login"><Menu className="h-5 w-5" /></button>
      </div>
    </header>
  );
}

function HomeScreen({ onStart, onAdmin }: { onStart: (size: number, name: string, email: string) => void; onAdmin: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [size, setSize] = useState(25);
  const begin = () => {
    if (name.trim().length < 2) return toast.error("Enter your full name to begin.");
    if (!/^\S+@gmail\.com$/i.test(email.trim())) return toast.error("Use your Gmail address as the student ID.");
    onStart(size, name.trim(), email.trim());
  };
  const subjectsForCards = [
    ["01", "Village Administration", "Land records, local governance and field duties", "#2e7d67"],
    ["02", "Indian Polity", "Constitutional basics and public administration", "#b9513e"],
    ["03", "Karnataka History", "Dynasties, culture and state landmarks", "#765020"],
    ["04", "Aptitude", "Fast, practical quantitative reasoning", "#244d70"],
    ["05", "General Knowledge", "Karnataka and India essentials", "#7a5d39"],
  ];
  return (
    <div className="min-h-screen bg-[#f8f5ee]">
      <PublicHeader onAdmin={onAdmin} />
      <main>
        <section className="relative overflow-hidden bg-[#173b5c] pb-20 pt-14 text-white md:pb-28 md:pt-20">
          <div className="pointer-events-none absolute -right-20 top-0 h-[420px] w-[420px] rounded-full border border-[#d08b24]/20" />
          <div className="container relative grid gap-14 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div className="max-w-2xl rise-in">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d08b24]/40 bg-[#d08b24]/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#f7d797]"><Sparkles className="h-3.5 w-3.5" /> Built for Karnataka VAO prep</div>
              <h1 className="font-serif text-5xl font-bold leading-[1.03] tracking-tight md:text-7xl">Practice with purpose.<br /><span className="text-[#e7b65f]">Arrive prepared.</span></h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-[#dbe6ec]">A focused practice desk for the Village Administrative Officer exam — mixed questions, realistic timing, and clear answer reviews that help you improve every attempt.</p>
              <div className="mt-9 flex flex-wrap gap-3 text-sm text-[#dbe6ec]"><span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#d08b24]" /> Karnataka-focused</span><span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#d08b24]" /> 1 minute per question</span><span className="flex items-center gap-2"><Check className="h-4 w-4 text-[#d08b24]" /> Detailed explanations</span></div>
            </div>
            <Card className="border-white/10 bg-[#fffdf8] text-[#1b252c] shadow-2xl shadow-[#102a41]/40 rise-in delay-1">
              <CardHeader className="border-b border-[#e5e0d4] pb-5"><div className="flex items-start justify-between"><div><p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-[#d08b24]">Quick entry</p><CardTitle className="font-serif text-2xl text-[#173b5c]">Start a practice set</CardTitle><CardDescription className="mt-1">Your attempt is tracked by name and Gmail ID.</CardDescription></div><div className="rounded-xl bg-[#f4ebdd] p-2.5 text-[#765020]"><Zap className="h-5 w-5" /></div></div></CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div className="grid gap-2"><Label htmlFor="candidate-name">Full name</Label><Input id="candidate-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Srijee" className="h-11 bg-white" /></div>
                <div className="grid gap-2"><Label htmlFor="candidate-email">Student ID / Gmail address</Label><Input id="candidate-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@gmail.com" className="h-11 bg-white" /><p className="text-xs text-[#68736f]">Used only to identify this attempt — no inbox access.</p></div>
                <div className="grid gap-2"><Label>Choose test length</Label><div className="grid grid-cols-4 gap-2">{sizes.map((value) => <button key={value} onClick={() => setSize(value)} className={`rounded-xl border px-2 py-3 text-center transition ${size === value ? "border-[#d08b24] bg-[#f4ebdd] text-[#765020] shadow-sm" : "border-[#e5e0d4] bg-white text-[#68736f] hover:border-[#d0c4ae]"}`}><span className="block text-lg font-bold">{value}</span><span className="text-[10px] uppercase tracking-wide">questions</span></button>)}</div></div>
                <Button onClick={begin} className="h-12 w-full bg-[#d08b24] font-bold text-[#173b5c] shadow-lg hover:bg-[#e2a03a]">Begin practice <ArrowRight className="ml-2 h-4 w-4" /></Button>
                <p className="text-center text-xs text-[#68736f]">Questions are mixed across nine VAO preparation categories.</p>
              </CardContent>
            </Card>
          </div>
        </section>
        <section id="subjects" className="container py-16 md:py-24"><div className="mb-10 flex flex-col justify-between gap-3 md:flex-row md:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d08b24]">One bank, five angles</p><h2 className="mt-2 font-serif text-3xl font-bold text-[#173b5c] md:text-4xl">Train for the whole paper</h2></div><p className="max-w-md text-sm leading-6 text-[#68736f]">Each practice set mixes the fundamentals that matter for Karnataka VAO preparation — not just one comfortable topic.</p></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{subjectsForCards.map(([number, title, description, color]) => <div key={title} className="group rounded-2xl border border-[#e5e0d4] bg-[#fffdf8] p-5 transition hover:-translate-y-1 hover:shadow-lg"><span className="text-xs font-bold" style={{ color }}>{number}</span><h3 className="mt-8 font-serif text-lg font-bold text-[#173b5c]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#68736f]">{description}</p><div className="mt-5 h-1 w-10 rounded-full" style={{ backgroundColor: color }} /></div>)}</div></section>
        <section id="how-it-works" className="border-y border-[#e5e0d4] bg-[#eef2ef] py-16 md:py-20"><div className="container"><div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#2e7d67]">A calmer way to practice</p><h2 className="mt-2 font-serif text-3xl font-bold text-[#173b5c] md:text-4xl">Know what to expect before the real thing.</h2><p className="mt-4 max-w-md leading-7 text-[#68736f]">Every session is structured like a short exam: timed, navigable, and followed by a review that tells you why the answer is right.</p></div><div className="grid gap-3 sm:grid-cols-3">{[["01", "Pick your pace", "25 to 100 questions, with one minute per question."], ["02", "Work the palette", "Jump around, clear answers, and flag what needs another look."], ["03", "Review the why", "See your answer, the correct answer, explanation, and source."]].map(([number, title, text]) => <div key={number} className="rounded-2xl bg-[#fffdf8] p-5 shadow-sm"><div className="mb-8 flex h-8 w-8 items-center justify-center rounded-lg bg-[#173b5c] text-xs font-bold text-white">{number}</div><h3 className="font-semibold text-[#173b5c]">{title}</h3><p className="mt-2 text-sm leading-6 text-[#68736f]">{text}</p></div>)}</div></div></div></section>
        <footer className="bg-[#173b5c] py-8 text-[#dbe6ec]"><div className="container flex flex-col justify-between gap-4 text-sm md:flex-row md:items-center"><div className="flex items-center gap-2"><div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#d08b24] text-[#173b5c]"><GraduationCap className="h-4 w-4" /></div><span>VAO Practice Desk</span></div><div className="flex items-center gap-5"><span>Built for focused Karnataka exam preparation</span><button onClick={onAdmin} className="text-[#f7d797] hover:underline">Admin access</button></div></div></footer>
      </main>
    </div>
  );
}

function QuizScreen({ questions, candidateName, candidateEmail, attemptId, onFinish, onSubmit, onExit }: { questions: PracticeQuestion[]; candidateName: string; candidateEmail: string; attemptId: number; onFinish: (record: AttemptRecord) => void; onSubmit: (payload: { attemptId: number; timeTakenSeconds: number; status: "submitted" | "timed_out"; answers: Array<{ questionId: number; questionIndex: number; selectedOption: Option | null; correctOption: Option; isFlagged: boolean }> }) => Promise<void>; onExit: () => void }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Option | undefined>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [secondsLeft, setSecondsLeft] = useState(questions.length * 60);
  const [startedAt] = useState(() => Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const question = questions[current];
  const answered = Object.values(answers).filter(Boolean).length;
  const submit = async (timedOut = false) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const timeTakenSeconds = Math.max(questions.length * 60 - secondsLeft, Math.floor((Date.now() - startedAt) / 1000));
    const score = questions.reduce((sum, item, index) => sum + (answers[index] === item.answer ? 1 : 0), 0);
    try {
      await onSubmit({ attemptId, timeTakenSeconds, status: timedOut ? "timed_out" : "submitted", answers: questions.map((item, index) => ({ questionId: item.id, questionIndex: index, selectedOption: answers[index] ?? null, correctOption: item.answer, isFlagged: flagged.has(index) })) });
      const record: AttemptRecord = { id: String(attemptId), candidateName, candidateEmail, date: new Date().toISOString(), quizSize: questions.length, score, accuracy: Math.round((score / questions.length) * 100), timeTaken: formatTime(timeTakenSeconds), questions, answers };
      onFinish(record);
      if (timedOut) toast.error("Time is up — your attempt was submitted.");
    } catch (error) {
      setIsSubmitting(false);
      toast.error(error instanceof Error ? error.message : "Could not sync your result. Please try again.");
    }
  };
  useEffect(() => {
    const timer = window.setInterval(() => setSecondsLeft((value) => { if (value <= 1) { window.clearInterval(timer); submit(true); return 0; } return value - 1; }), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return (
    <div className="min-h-screen bg-[#f1efe8]">
      <header className="sticky top-0 z-20 border-b border-[#e5e0d4] bg-[#fffdf8]/95 shadow-sm backdrop-blur"><div className="container flex h-[72px] items-center justify-between gap-4"><button onClick={onExit} className="flex items-center gap-2 text-sm font-semibold text-[#173b5c] hover:text-[#d08b24]"><ArrowLeft className="h-4 w-4" /> Exit practice</button><div className="hidden items-center gap-3 sm:flex"><div className="h-2 w-32 overflow-hidden rounded-full bg-[#e5e0d4] md:w-48"><div className="h-full rounded-full bg-[#2e7d67]" style={{ width: `${(answered / questions.length) * 100}%` }} /></div><span className="text-sm font-semibold text-[#68736f]">{answered}/{questions.length} answered</span></div><div className={`flex items-center gap-2 rounded-full px-4 py-2 font-mono text-sm font-bold ${secondsLeft < 60 ? "bg-[#f6e9e5] text-[#934536]" : "bg-[#f4ebdd] text-[#765020]"}`}><Clock3 className="h-4 w-4" /> {formatTime(secondsLeft)}</div></div></header>
      <main className="container py-6 md:py-8"><div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d08b24]">Practice session · {candidateName}</p><h1 className="mt-1 font-serif text-2xl font-bold text-[#173b5c]">Question {current + 1} <span className="font-sans text-base font-normal text-[#68736f]">of {questions.length}</span></h1></div><Badge variant="outline" className="border-[#d3c8b4] bg-[#fffdf8] text-[#68736f]">Mixed VAO set</Badge></div><div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <Card className="border-[#e5e0d4] bg-[#fffdf8] shadow-sm"><CardContent className="p-6 md:p-10"><div className="mb-8 flex items-center justify-between"><Badge className="border-0 bg-[#e9f2ed] text-[#285842]">{question.subject}</Badge><button onClick={() => setFlagged((previous) => { const next = new Set(previous); next.has(current) ? next.delete(current) : next.add(current); return next; })} className={`flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold ${flagged.has(current) ? "border-[#d08b24] bg-[#f4ebdd] text-[#765020]" : "border-[#e5e0d4] text-[#68736f]"}`}><Flag className={`h-3.5 w-3.5 ${flagged.has(current) ? "fill-current" : ""}`} /> {flagged.has(current) ? "Flagged" : "Flag for review"}</button></div><h2 className="max-w-3xl font-serif text-2xl font-bold leading-snug text-[#173b5c] md:text-3xl">{question.prompt}</h2><div className="mt-9 grid gap-3">{optionLetters.map((letter) => <button key={letter} onClick={() => setAnswers((previous) => ({ ...previous, [current]: letter }))} className={`group flex items-start gap-4 rounded-2xl border p-4 text-left transition ${answers[current] === letter ? "border-[#2e7d67] bg-[#e9f2ed] shadow-sm" : "border-[#e5e0d4] bg-white hover:border-[#c6b89f]"}`}><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${answers[current] === letter ? "bg-[#2e7d67] text-white" : optionColors[letter]}`}>{letter}</span><span className={`pt-1 text-sm leading-6 ${answers[current] === letter ? "font-semibold text-[#285842]" : "text-[#354247]"}`}>{question.options[letter]}</span>{answers[current] === letter && <Check className="ml-auto mt-1 h-4 w-4 text-[#2e7d67]" />}</button>)}</div><div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[#e5e0d4] pt-5"><button onClick={() => setAnswers((previous) => ({ ...previous, [current]: undefined }))} className="text-sm font-semibold text-[#68736f] hover:text-[#934536]">Clear answer</button><div className="flex gap-2"><Button variant="outline" disabled={current === 0} onClick={() => setCurrent((value) => Math.max(0, value - 1))} className="border-[#d3c8b4] bg-white"><ArrowLeft className="mr-2 h-4 w-4" /> Previous</Button>{current === questions.length - 1 ? <Button onClick={() => submit()} disabled={isSubmitting} className="bg-[#173b5c] text-white hover:bg-[#234b70]">{isSubmitting ? "Syncing result..." : "Finish attempt"} <Check className="ml-2 h-4 w-4" /></Button> : <Button onClick={() => setCurrent((value) => Math.min(questions.length - 1, value + 1))} className="bg-[#d08b24] text-[#173b5c] hover:bg-[#e2a03a]">Next question <ArrowRight className="ml-2 h-4 w-4" /></Button>}</div></div></CardContent></Card>
        <aside className="h-fit space-y-4 lg:sticky lg:top-24"><Card className="border-[#e5e0d4] bg-[#fffdf8] shadow-sm"><CardHeader className="pb-3"><CardTitle className="flex items-center gap-2 text-base text-[#173b5c]"><LayoutDashboard className="h-4 w-4 text-[#d08b24]" /> Question palette</CardTitle><CardDescription>Jump to any question</CardDescription></CardHeader><CardContent><div className="grid grid-cols-5 gap-2">{questions.map((_, index) => <button key={index} onClick={() => setCurrent(index)} className={`relative h-9 rounded-lg text-xs font-bold ${current === index ? "bg-[#173b5c] text-white ring-2 ring-[#d08b24] ring-offset-1" : answers[index] ? "bg-[#e9f2ed] text-[#285842]" : "bg-[#f0eee7] text-[#68736f]"}`}>{index + 1}{flagged.has(index) && <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-[#d08b24]" />}</button>)}</div><div className="mt-5 grid gap-2 text-xs text-[#68736f]"><span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-[#e9f2ed]" /> Answered</span><span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-[#f0eee7]" /> Not answered</span><span className="flex items-center gap-2"><i className="h-2.5 w-2.5 rounded-full bg-[#d08b24]" /> Flagged</span></div></CardContent></Card><div className="rounded-2xl bg-[#173b5c] p-5 text-white"><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#f7d797]">Quick reminder</p><p className="mt-3 text-sm leading-6 text-[#dbe6ec]">There is no penalty for guessing. Use the flag when you want to return before finishing.</p></div></aside>
      </div></main>
    </div>
  );
}

function ResultScreen({ record, onRetry, onHome }: { record: AttemptRecord; onRetry: () => void; onHome: () => void }) {
  const correct = record.score;
  const wrong = record.questions.filter((question, index) => record.answers[index] && record.answers[index] !== question.answer).length;
  return (
    <div className="min-h-screen bg-[#f8f5ee]"><header className="border-b border-[#315776] bg-[#173b5c]"><div className="container flex h-[74px] items-center justify-between"><Brand /><Button onClick={onHome} variant="outline" className="border-white/25 bg-transparent text-white hover:bg-white/10">Back to home</Button></div></header>
      <main className="container max-w-6xl py-10 md:py-14"><div className="mb-8"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d08b24]">Attempt complete</p><h1 className="mt-2 font-serif text-4xl font-bold text-[#173b5c] md:text-5xl">Good work, {record.candidateName.split(" ")[0]}.</h1><p className="mt-3 text-[#68736f]">Here is your review for the {record.quizSize}-question mixed VAO set.</p></div>
        <div className="grid gap-4 md:grid-cols-4"><Summary label="Score" value={`${record.score}/${record.quizSize}`} color="text-[#173b5c]" /><Summary label="Accuracy" value={`${record.accuracy}%`} color="text-[#2e7d67]" /><Summary label="Time taken" value={record.timeTaken} color="text-[#765020]" /><Summary label="Answered" value={`${correct + wrong}/${record.quizSize}`} color="text-[#244d70]" /></div>
        <div className="mt-8 grid gap-8 lg:grid-cols-[.8fr_1.2fr]"><Card className="h-fit border-[#e5e0d4] bg-[#fffdf8]"><CardHeader><CardTitle className="font-serif text-xl text-[#173b5c]">Your snapshot</CardTitle><CardDescription>Use this as your next revision plan.</CardDescription></CardHeader><CardContent className="space-y-4"><ScoreLine label="Correct" value={correct} className="bg-[#e9f2ed] text-[#285842]" /><ScoreLine label="Incorrect" value={wrong} className="bg-[#f6e9e5] text-[#934536]" /><ScoreLine label="Unanswered" value={record.quizSize - correct - wrong} className="bg-[#f0eee7] text-[#68736f]" /><div className="flex gap-2 pt-2"><Button onClick={onRetry} className="flex-1 bg-[#d08b24] text-[#173b5c] hover:bg-[#e2a03a]"><RotateCcw className="mr-2 h-4 w-4" /> Try again</Button><Button onClick={onHome} variant="outline" className="border-[#d3c8b4]">Home</Button></div></CardContent></Card>
          <div><div className="mb-4 flex items-center justify-between"><h2 className="font-serif text-2xl font-bold text-[#173b5c]">Question-by-question review</h2><Badge variant="outline" className="border-[#d3c8b4] bg-[#fffdf8]">{record.questions.length} items</Badge></div><div className="space-y-3">{record.questions.map((question, index) => <ReviewCard key={`${question.id}-${index}`} question={question} selected={record.answers[index]} index={index} />)}</div></div>
        </div>
      </main>
    </div>
  );
}
function Summary({ label, value, color }: { label: string; value: string; color: string }) { return <Card className="border-[#e5e0d4] bg-[#fffdf8]"><CardContent className="p-5"><p className="text-xs font-bold uppercase tracking-wide text-[#68736f]">{label}</p><p className={`mt-2 font-serif text-3xl font-bold ${color}`}>{value}</p></CardContent></Card>; }
function ScoreLine({ label, value, className }: { label: string; value: number; className: string }) { return <div className={`flex items-center justify-between rounded-xl p-4 ${className}`}><span className="text-sm">{label}</span><span className="font-bold">{value}</span></div>; }
function ReviewCard({ question, selected, index }: { question: PracticeQuestion; selected?: Option; index: number }) { const correct = selected === question.answer; return <Card className={`border-l-4 bg-[#fffdf8] ${correct ? "border-l-[#2e7d67]" : selected ? "border-l-[#b9513e]" : "border-l-[#c8c0b2]"}`}><CardContent className="p-5"><div className="flex gap-3"><div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${correct ? "bg-[#e9f2ed] text-[#285842]" : selected ? "bg-[#f6e9e5] text-[#934536]" : "bg-[#f0eee7] text-[#68736f]"}`}>{index + 1}</div><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><Badge variant="outline" className="border-[#e5e0d4] text-[10px] text-[#68736f]">{question.subject}</Badge><span className={`text-xs font-bold ${correct ? "text-[#2e7d67]" : "text-[#934536]"}`}>{correct ? "Correct" : selected ? "Needs review" : "Not answered"}</span></div><p className="mt-2 font-semibold leading-6 text-[#173b5c]">{question.prompt}</p><div className="mt-3 grid gap-2 text-sm md:grid-cols-2"><p className="rounded-lg bg-[#f0eee7] px-3 py-2 text-[#68736f]">Your answer: <strong className="text-[#1b252c]">{selected ? `${selected}. ${question.options[selected]}` : "Not answered"}</strong></p><p className="rounded-lg bg-[#e9f2ed] px-3 py-2 text-[#285842]">Correct: <strong>{question.answer}. {question.options[question.answer]}</strong></p></div><p className="mt-3 text-sm leading-6 text-[#68736f]"><strong className="text-[#173b5c]">Why:</strong> {question.explanation}</p><p className="mt-2 flex items-center gap-1.5 text-xs text-[#9a8f7b]"><FileText className="h-3.5 w-3.5" /> Source: {question.source}{question.page ? ` · p. ${question.page}` : ""}</p></div></div></CardContent></Card>; }

function AdminLogin({ onSuccess, onHome }: { onSuccess: (credentials: { id: string; password: string }) => void; onHome: () => void }) {
  const [id, setId] = useState(""); const [password, setPassword] = useState("");
  const login = trpc.admin.login.useMutation({ onSuccess: () => onSuccess({ id, password }), onError: (error) => toast.error(error.message || "Unable to sign in") });
  return <div className="flex min-h-screen items-center justify-center bg-[#173b5c] px-4 py-10"><Card className="relative w-full max-w-md border-white/10 bg-[#fffdf8] shadow-2xl"><CardHeader className="pb-5"><button onClick={onHome} className="mb-8 flex w-fit items-center gap-2 text-sm font-semibold text-[#68736f] hover:text-[#173b5c]"><ArrowLeft className="h-4 w-4" /> Back to practice</button><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f4ebdd] text-[#765020]"><ShieldCheck className="h-6 w-6" /></div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d08b24]">Restricted area</p><CardTitle className="mt-1 font-serif text-3xl text-[#173b5c]">Administrator sign in</CardTitle><CardDescription>Manage question sets and review candidate performance.</CardDescription></CardHeader><CardContent className="space-y-5"><div className="grid gap-2"><Label htmlFor="admin-id">Admin ID</Label><Input id="admin-id" value={id} onChange={(event) => setId(event.target.value)} placeholder="Enter admin ID" className="h-11" /></div><div className="grid gap-2"><Label htmlFor="admin-password">Password</Label><Input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter password" className="h-11" /></div><Button onClick={() => login.mutate({ id, password })} disabled={login.isPending} className="h-12 w-full bg-[#173b5c] text-white hover:bg-[#234b70]">{login.isPending ? "Checking..." : "Open admin dashboard"}<ChevronRight className="ml-2 h-4 w-4" /></Button><p className="flex items-start gap-2 rounded-xl bg-[#f0eee7] p-3 text-xs leading-5 text-[#68736f]"><LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#765020]" /> This portal is for the question-bank owner. Candidate attempts do not require this sign in.</p></CardContent></Card></div>;
}

function AdminScreen({ onLogout, credentials }: { onLogout: () => void; credentials: { id: string; password: string } }) {
  const [tab, setTab] = useState<"overview" | "upload" | "bank" | "results">("overview");
  const [questions, setQuestions] = useState(sampleQuestions);
  const [attempts, setAttempts] = useState<AttemptRecord[]>(() => JSON.parse(localStorage.getItem("vao_attempts") || "[]"));
  const [search, setSearch] = useState(""); const [filter, setFilter] = useState<Subject | "all">("all"); const [text, setText] = useState(""); const [fileName, setFileName] = useState("");
  const serverQuestionBank = trpc.admin.questionBank.useQuery(credentials, { refetchInterval: 15000 });
  const ingestText = trpc.admin.ingestText.useMutation({ onSuccess: async (data) => { await serverQuestionBank.refetch(); toast.success(`${data.count} question${data.count === 1 ? "" : "s"} saved to the server question bank.`); }, onError: (error) => toast.error(error.message) });
  const uploadPdf = trpc.admin.uploadPdf.useMutation({ onSuccess: (data) => toast.success(`${data.fileName} uploaded and saved for manual review.`), onError: (error) => toast.error(error.message) });
  const serverAttempts = trpc.admin.attempts.useQuery(credentials, { refetchInterval: 15000 });
  useEffect(() => {
    if (!serverQuestionBank.data) return;
    setQuestions(serverQuestionBank.data.map((item) => ({
      id: item.id,
      subject: item.subject as Subject,
      prompt: item.prompt,
      options: { A: item.optionA, B: item.optionB, C: item.optionC, D: item.optionD },
      answer: item.correctOption as Option,
      explanation: item.explanation,
      source: "Server question bank",
      page: item.sourcePage ?? undefined,
    })));
  }, [serverQuestionBank.data]);
  useEffect(() => { if (serverAttempts.data) setAttempts(serverAttempts.data.map((attempt) => ({ id: String(attempt.id), candidateName: attempt.candidateName, candidateEmail: attempt.candidateEmail, date: new Date(attempt.startedAt).toISOString(), quizSize: attempt.quizSize, score: attempt.score, accuracy: attempt.accuracy, timeTaken: formatTime(attempt.timeTakenSeconds), questions: [], answers: {} }))); }, [serverAttempts.data]);
  const filtered = useMemo(() => questions.filter((question) => (filter === "all" || question.subject === filter) && (!search || `${question.prompt} ${question.explanation}`.toLowerCase().includes(search.toLowerCase()))), [questions, search, filter]);
  const addPastedQuestions = () => {
    const normalized = text.replace(/\r/g, "").trim();
    const extracted: PracticeQuestion[] = normalized.split(/\n\s*(?=Q\s*\d*\s*[:.)-])/i).map((block, index) => {
      const lines = block.trim().split("\n").map((line) => line.trim()).filter(Boolean);
      const prompt = lines.find((line) => /^q\s*\d*\s*[:.)-]/i.test(line))?.replace(/^q\s*\d*\s*[:.)-]\s*/i, "") || lines[0];
      const options = lines.filter((line) => /^[ABCD]\s*[:.)-]\s*/i.test(line)).map((line) => line.replace(/^[ABCD]\s*[:.)-]\s*/i, ""));
      const answerLine = lines.find((line) => /^(answer|ans|correct)\s*[:.)-]?\s*[ABCD]\b/i.test(line));
      const answer = answerLine?.replace(/^(answer|ans|correct)\s*[:.)-]?\s*/i, "").match(/^[ABCD]\b/i)?.[0]?.toUpperCase() as Option | undefined;
      const explanationIndex = lines.findIndex((line) => /^explanation\s*[:.)-]/i.test(line));
      const explanation = explanationIndex >= 0 ? lines.slice(explanationIndex).join(" ").replace(/^explanation\s*[:.)-]\s*/i, "") : "Review the source material and confirm the reasoning behind this answer.";
      if (!prompt || options.length < 4 || !answer) return null;
      return { id: Date.now() + index, subject: "General Knowledge" as Subject, prompt, options: { A: options[0], B: options[1], C: options[2], D: options[3] }, answer, explanation, source: fileName || "Admin pasted question set" };
    }).filter((question): question is PracticeQuestion => Boolean(question));
    if (!extracted.length) return toast.error("No complete MCQ blocks detected. Use the format shown below.");
    ingestText.mutate({ ...credentials, title: fileName || "Admin pasted question set", text, sourceType: "paste" });
    setQuestions((current) => [...extracted, ...current]); setText(""); setFileName(""); toast.success(`${extracted.length} question${extracted.length > 1 ? "s" : ""} added to the local review preview.`);
  };
  const uploadSelectedPdf = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > 5_000_000) return toast.error("Please keep PDF uploads under 5 MB.");
    const dataBase64 = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(String(reader.result).split(",")[1] || ""); reader.onerror = reject; reader.readAsDataURL(file); });
    setFileName(file.name);
    uploadPdf.mutate({ ...credentials, title: file.name.replace(/\.pdf$/i, "") || "VAO PDF question set", fileName: file.name, contentType: file.type || "application/pdf", dataBase64 });
  };
  const nav = [{ id: "overview", icon: LayoutDashboard, label: "Overview" }, { id: "upload", icon: Upload, label: "Upload & extract" }, { id: "bank", icon: BookOpen, label: "Question bank" }, { id: "results", icon: BarChart3, label: "Student results" }] as const;
  return <div className="min-h-screen bg-[#f1efe8]"><aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-[#173b5c] text-white md:flex"><div className="p-6"><Brand /></div><div className="px-3 py-4">{nav.map((item) => <button key={item.id} onClick={() => setTab(item.id)} className={`mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold ${tab === item.id ? "bg-[#234b70] text-white" : "text-[#c7d5dc] hover:bg-white/5 hover:text-white"}`}><item.icon className="h-4 w-4" />{item.label}</button>)}</div><div className="mt-auto border-t border-[#315776] p-4"><div className="mb-4 flex items-center gap-3 rounded-xl bg-white/5 p-3"><div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d08b24] text-sm font-bold text-[#173b5c]">A</div><div><p className="text-sm font-semibold">Administrator</p><p className="text-xs text-[#b8c9d2]">Question bank owner</p></div></div><button onClick={onLogout} className="flex items-center gap-2 px-3 text-sm text-[#dbe6ec] hover:text-[#f7d797]"><LogOut className="h-4 w-4" /> Sign out</button></div></aside><div className="md:pl-64"><header className="sticky top-0 z-20 border-b border-[#e5e0d4] bg-[#fffdf8]/95 backdrop-blur"><div className="container flex h-[74px] items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d08b24]">Administrator workspace</p><h1 className="font-serif text-2xl font-bold text-[#173b5c]">{nav.find((item) => item.id === tab)?.label}</h1></div><button onClick={onLogout} className="rounded-lg p-2 text-[#68736f] hover:bg-[#f0eee7] md:hidden"><LogOut className="h-4 w-4" /></button></div></header><main className="container py-7 md:py-10">{tab === "overview" && <AdminOverview questions={questions} attempts={attempts} onNavigate={setTab} />}{tab === "upload" && <AdminUpload fileName={fileName} text={text} setText={setText} onExtract={addPastedQuestions} onSelectFile={uploadSelectedPdf} />}{tab === "bank" && <AdminBank questions={filtered} search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} />}{tab === "results" && <AdminResults attempts={attempts} />}</main></div></div>;
}

function AdminOverview({ questions, attempts, onNavigate }: { questions: PracticeQuestion[]; attempts: AttemptRecord[]; onNavigate: (tab: "upload" | "bank" | "results") => void }) {
  const average = attempts.length ? Math.round(attempts.reduce((sum, attempt) => sum + attempt.accuracy, 0) / attempts.length) : 0;
  const gitCommands = [
    "git init",
    "git remote add origin https://github.com/srijee31/Quiz-Exam-Website.git",
    "git add .",
    "git commit -m \"Feat: Complete VAO practice quiz app with PDF question bank & results dashboard\"",
    "git branch -M main",
    "git push -u origin main",
  ].join("\n");
  return <div className="space-y-8"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Stat label="Active questions" value={questions.length} detail="Across 5 subjects" icon={BookOpen} /><Stat label="Candidate attempts" value={attempts.length} detail="Tracked in this workspace" icon={Users} /><Stat label="Average accuracy" value={`${average}%`} detail="Across recorded attempts" icon={BarChart3} /><Stat label="Question sets" value="01" detail="Karnataka VAO sample bank" icon={FileText} /></div><div className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]"><Card className="border-[#e5e0d4] bg-[#fffdf8]"><CardHeader className="flex-row items-center justify-between"><div><CardTitle className="font-serif text-xl text-[#173b5c]">Keep the bank fresh</CardTitle><CardDescription>Upload a new PDF or paste MCQs for review.</CardDescription></div><Button onClick={() => onNavigate("upload")} className="bg-[#d08b24] text-[#173b5c] hover:bg-[#e2a03a]"><Upload className="mr-2 h-4 w-4" /> Add questions</Button></CardHeader><CardContent><div className="grid gap-3 sm:grid-cols-2"><button onClick={() => onNavigate("upload")} className="rounded-2xl border border-dashed border-[#d3c8b4] bg-[#fbfaf5] p-5 text-left hover:border-[#d08b24]"><FileText className="h-6 w-6 text-[#d08b24]" /><p className="mt-4 font-semibold text-[#173b5c]">Upload a PDF set</p><p className="mt-1 text-sm leading-6 text-[#68736f]">Store the source and review extracted questions before publishing.</p></button><button onClick={() => onNavigate("upload")} className="rounded-2xl border border-dashed border-[#d3c8b4] bg-[#fbfaf5] p-5 text-left hover:border-[#2e7d67]"><BookOpen className="h-6 w-6 text-[#2e7d67]" /><p className="mt-4 font-semibold text-[#173b5c]">Paste MCQ text</p><p className="mt-1 text-sm leading-6 text-[#68736f]">Use the structured template for a clean extraction preview.</p></button></div></CardContent></Card><Card className="border-[#e5e0d4] bg-[#fffdf8]"><CardHeader><CardTitle className="font-serif text-xl text-[#173b5c]">Git workflow</CardTitle><CardDescription>Push the completed project to the selected repository.</CardDescription></CardHeader><CardContent><pre className="overflow-auto rounded-xl bg-[#173b5c] p-4 text-xs leading-6 text-[#dbe6ec]">{gitCommands}</pre><p className="mt-3 text-xs text-[#68736f]">Secrets are stored in the server environment and should never be committed.</p></CardContent></Card></div><Card className="border-[#e5e0d4] bg-[#fffdf8]"><CardHeader className="flex-row items-center justify-between"><div><CardTitle className="font-serif text-xl text-[#173b5c]">Recent candidate attempts</CardTitle><CardDescription>Monitor practice activity at a glance.</CardDescription></div><Button variant="outline" onClick={() => onNavigate("results")} className="border-[#d3c8b4] bg-white">View all <ArrowRight className="ml-2 h-4 w-4" /></Button></CardHeader><CardContent>{attempts.length ? <ResultsTable attempts={attempts.slice(0, 5)} /> : <Empty title="No attempts yet" description="Candidate results will appear here after the first practice session." />}</CardContent></Card></div>;
}
function Stat({ label, value, detail, icon: Icon }: { label: string; value: string | number; detail: string; icon: typeof BookOpen }) { return <Card className="border-[#e5e0d4] bg-[#fffdf8]"><CardContent className="p-5"><div className="flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-wide text-[#68736f]">{label}</p><p className="mt-2 font-serif text-3xl font-bold text-[#173b5c]">{value}</p></div><div className="rounded-xl bg-[#f4ebdd] p-2.5 text-[#765020]"><Icon className="h-5 w-5" /></div></div><p className="mt-3 text-xs text-[#9a8f7b]">{detail}</p></CardContent></Card>; }
function AdminUpload({ fileName, text, setText, onExtract, onSelectFile }: { fileName: string; text: string; setText: (value: string) => void; onExtract: () => void; onSelectFile: (file: File | undefined) => void }) { return <div className="grid gap-6 lg:grid-cols-[.9fr_1.1fr]"><Card className="border-[#e5e0d4] bg-[#fffdf8]"><CardHeader><CardTitle className="font-serif text-xl text-[#173b5c]">Add a question set</CardTitle><CardDescription>PDF uploads are stored as source references. Paste text for the extraction preview.</CardDescription></CardHeader><CardContent className="space-y-6"><label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#cfc5b4] bg-[#fbfaf5] px-6 py-10 text-center hover:border-[#d08b24]"><Upload className="h-8 w-8 text-[#d08b24]" /><p className="mt-3 font-semibold text-[#173b5c]">Choose a PDF question set</p><p className="mt-1 text-xs text-[#68736f]">Text-based PDFs extract more reliably. Scanned or image-only PDFs require manual review before publishing.</p><input type="file" accept="application/pdf,.txt" className="hidden" onChange={(event) => onSelectFile(event.target.files?.[0])} />{fileName && <Badge className="mt-4 border-0 bg-[#e9f2ed] text-[#285842]">{fileName}</Badge>}</label><div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#e5e0d4]" /></div><div className="relative flex justify-center"><span className="bg-[#fffdf8] px-3 text-xs uppercase tracking-widest text-[#9a8f7b]">or paste MCQs</span></div></div><div className="grid gap-2"><Label htmlFor="mcq-text">MCQ text</Label><Textarea id="mcq-text" value={text} onChange={(event) => setText(event.target.value)} placeholder="Use Q1: ... A) ... B) ... C) ... D) ... Answer: B Explanation: ..." className="min-h-52 resize-y bg-white font-mono text-xs leading-6" /></div><Button onClick={onExtract} disabled={!text.trim()} className="w-full bg-[#173b5c] text-white hover:bg-[#234b70]"><Sparkles className="mr-2 h-4 w-4" /> Extract & add to review bank</Button></CardContent></Card><Card className="h-fit border-[#e5e0d4] bg-[#fffdf8]"><CardHeader><CardTitle className="font-serif text-xl text-[#173b5c]">Extraction checklist</CardTitle><CardDescription>Keep source quality high.</CardDescription></CardHeader><CardContent className="space-y-3">{[[FileText, "Readable source", "Text-based PDFs extract more reliably than scanned images."], [Check, "Four options", "Every question should have A, B, C and D options."], [ShieldCheck, "Verify answers", "Review the answer and explanation before using a new set."], [BookOpen, "Keep the subject", "Tag questions so mixed quizzes stay balanced."]].map(([Icon, title, description]) => { const IconComponent = Icon as typeof FileText; return <div key={title as string} className="flex gap-3 rounded-xl bg-[#f0eee7] p-4"><div className="mt-0.5 rounded-lg bg-[#fffdf8] p-2 text-[#2e7d67]"><IconComponent className="h-4 w-4" /></div><div><p className="text-sm font-semibold text-[#173b5c]">{title as string}</p><p className="mt-1 text-xs leading-5 text-[#68736f]">{description as string}</p></div></div>; })}</CardContent></Card></div>; }
function AdminBank({ questions, search, setSearch, filter, setFilter }: { questions: PracticeQuestion[]; search: string; setSearch: (value: string) => void; filter: Subject | "all"; setFilter: (value: Subject | "all") => void }) { return <div className="space-y-5"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-center"><p className="text-sm text-[#68736f]">{questions.length} questions in the active bank</p><div className="flex flex-col gap-2 sm:flex-row"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9a8f7b]" /><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search questions..." className="h-10 bg-[#fffdf8] pl-9 sm:w-64" /></div><select value={filter} onChange={(event) => setFilter(event.target.value as Subject | "all")} className="h-10 rounded-md border border-[#ddd8ca] bg-[#fffdf8] px-3 text-sm text-[#354247]"><option value="all">All subjects</option>{subjects.slice(1).map((subject) => <option key={subject.value} value={subject.value}>{subject.label}</option>)}</select></div></div><Card className="overflow-hidden border-[#e5e0d4] bg-[#fffdf8]"><CardContent className="p-0"><div className="overflow-x-auto"><table className="w-full min-w-[780px] text-left text-sm"><thead className="border-b border-[#e5e0d4] bg-[#fbfaf5] text-xs uppercase tracking-wide text-[#68736f]"><tr><th className="px-5 py-4">Question</th><th className="px-5 py-4">Subject</th><th className="px-5 py-4">Correct</th><th className="px-5 py-4">Source</th></tr></thead><tbody className="divide-y divide-[#eee9df]">{questions.map((question, index) => <tr key={`${question.id}-${index}`} className="hover:bg-[#fbfaf5]"><td className="max-w-md px-5 py-4"><p className="font-semibold text-[#173b5c]">{question.prompt}</p><p className="mt-1 text-xs leading-5 text-[#68736f]">{question.explanation}</p></td><td className="px-5 py-4"><Badge variant="outline" className="border-[#d3c8b4] text-xs font-normal text-[#68736f]">{question.subject}</Badge></td><td className="px-5 py-4"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#e9f2ed] text-xs font-bold text-[#285842]">{question.answer}</span></td><td className="px-5 py-4 text-xs text-[#68736f]">{question.source}</td></tr>)}</tbody></table></div>{!questions.length && <Empty title="No questions found" description="Try a different subject or search term." />}</CardContent></Card></div>; }
function AdminResults({ attempts }: { attempts: AttemptRecord[] }) { const exportCsv = () => { const csv = ["Name,Email,Date,Quiz size,Score,Accuracy,Time taken", ...attempts.map((attempt) => [attempt.candidateName, attempt.candidateEmail, new Date(attempt.date).toLocaleDateString(), attempt.quizSize, attempt.score, `${attempt.accuracy}%`, attempt.timeTaken].join(","))].join("\n"); const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" })); const link = document.createElement("a"); link.href = url; link.download = "vao-attempts.csv"; link.click(); URL.revokeObjectURL(url); }; return <div className="space-y-5"><div className="flex items-end justify-between"><p className="text-sm text-[#68736f]">{attempts.length} recorded attempt{attempts.length === 1 ? "" : "s"}</p><Button variant="outline" onClick={exportCsv} className="border-[#d3c8b4] bg-[#fffdf8]"><Download className="mr-2 h-4 w-4" /> Export CSV</Button></div><Card className="border-[#e5e0d4] bg-[#fffdf8]"><CardContent className="p-0"><ResultsTable attempts={attempts} /></CardContent></Card></div>; }
function ResultsTable({ attempts }: { attempts: AttemptRecord[] }) { return <div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left text-sm"><thead className="border-b border-[#e5e0d4] bg-[#fbfaf5] text-xs uppercase tracking-wide text-[#68736f]"><tr><th className="px-5 py-4">Candidate</th><th className="px-5 py-4">Date</th><th className="px-5 py-4">Quiz size</th><th className="px-5 py-4">Score</th><th className="px-5 py-4">Accuracy</th><th className="px-5 py-4">Time taken</th></tr></thead><tbody className="divide-y divide-[#eee9df]">{attempts.map((attempt) => <tr key={attempt.id} className="hover:bg-[#fbfaf5]"><td className="px-5 py-4"><p className="font-semibold text-[#173b5c]">{attempt.candidateName}</p><p className="text-xs text-[#68736f]">{attempt.candidateEmail}</p></td><td className="px-5 py-4 text-[#68736f]">{new Date(attempt.date).toLocaleDateString()}</td><td className="px-5 py-4 text-[#68736f]">{attempt.quizSize} questions</td><td className="px-5 py-4 font-semibold text-[#173b5c]">{attempt.score}/{attempt.quizSize}</td><td className="px-5 py-4"><span className="rounded-full bg-[#e9f2ed] px-2.5 py-1 text-xs font-bold text-[#285842]">{attempt.accuracy}%</span></td><td className="px-5 py-4 text-[#68736f]">{attempt.timeTaken}</td></tr>)}</tbody></table>{!attempts.length && <Empty title="No attempts yet" description="Candidate results will populate after a quiz is completed." />}</div>; }
function Empty({ title, description }: { title: string; description: string }) { return <div className="flex flex-col items-center justify-center px-6 py-14 text-center"><div className="rounded-2xl bg-[#f0eee7] p-3 text-[#9a8f7b]"><Users className="h-6 w-6" /></div><p className="mt-4 font-semibold text-[#173b5c]">{title}</p><p className="mt-1 max-w-sm text-sm text-[#68736f]">{description}</p></div>; }

export default function Home() {
  const [, setLocation] = useLocation();
  const [screen, setScreen] = useState<Screen>(() => window.location.pathname === "/admin" ? "admin-login" : "home");
  const [adminCredentials, setAdminCredentials] = useState<{ id: string; password: string } | null>(null);
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [candidate, setCandidate] = useState({ name: "", email: "" });
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const startAttempt = trpc.candidate.start.useMutation({ onError: (error) => toast.error(error.message || "Could not start the server-backed quiz") });
  const submitAttempt = trpc.candidate.submit.useMutation();
  const [result, setResult] = useState<AttemptRecord | null>(null);
  const start = (size: number, name: string, email: string) => {
    startAttempt.mutate({ candidateName: name, candidateEmail: email, quizSize: size as 25 | 50 | 75 | 100 }, {
      onSuccess: (data) => {
        const serverQuestions: PracticeQuestion[] = data.questions.map((item) => ({ id: item.id, subject: item.subject as Subject, prompt: item.prompt, options: { A: item.optionA, B: item.optionB, C: item.optionC, D: item.optionD }, answer: item.correctOption as Option, explanation: item.explanation, source: "Server question bank", page: item.sourcePage ?? undefined }));
        setCandidate({ name, email });
        setQuestions(serverQuestions);
        setAttemptId(data.id ?? null);
        setScreen("quiz");
        window.scrollTo({ top: 0 });
      },
    });
  };
  const submitToServer = (payload: Parameters<typeof submitAttempt.mutateAsync>[0]) => submitAttempt.mutateAsync(payload).then(() => undefined);
  const finish = (record: AttemptRecord) => { const saved = JSON.parse(localStorage.getItem("vao_attempts") || "[]") as AttemptRecord[]; localStorage.setItem("vao_attempts", JSON.stringify([{ ...record, candidateEmail: candidate.email }, ...saved])); setResult({ ...record, candidateEmail: candidate.email }); setScreen("result"); window.scrollTo({ top: 0 }); };
  const home = () => { setScreen("home"); setLocation("/"); window.scrollTo({ top: 0 }); };
  const admin = () => { setScreen("admin-login"); setLocation("/admin"); window.scrollTo({ top: 0 }); };
  if (screen === "quiz" && attemptId !== null) return <QuizScreen questions={questions} candidateName={candidate.name} candidateEmail={candidate.email} attemptId={attemptId} onFinish={finish} onSubmit={submitToServer} onExit={home} />;
  if (screen === "result" && result) return <ResultScreen record={result} onRetry={() => start(result.quizSize, result.candidateName, result.candidateEmail)} onHome={home} />;
  if (screen === "admin-login") return <AdminLogin onSuccess={(credentials) => { setAdminCredentials(credentials); setScreen("admin"); }} onHome={home} />;
  if (screen === "admin" && adminCredentials) return <AdminScreen credentials={adminCredentials} onLogout={() => { setAdminCredentials(null); home(); }} />;
  return <HomeScreen onStart={start} onAdmin={admin} />;
}
