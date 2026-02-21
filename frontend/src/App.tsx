"use client";

import "./App.css";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { UploadCloud, Sparkles, ArrowRight } from "lucide-react";

type FeedbackResponse = {
  overall_feedback: string[];
  education_tips: string[];
  experience_tips: string[];
  projects_tips: string[];
  skills_tips: string[];
  ats_tips: string[];
};

function TipsSection({
  title,
  items,
}: {
  title: string;
  items: string[] | undefined;
}) {
  if (!items || items.length === 0) return null;

  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="list-disc pl-5 space-y-1">
          {items.map((tip, idx) => (
            <li key={`${title}-${idx}`} className="text-sm text-muted-foreground">
              {tip}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function DoodleArrow(props: { className?: string }) {
  // simple “hand-drawn” arrow via SVG
  return (
    <svg
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={props.className}
    >
      <path
        d="M20 35 C45 10, 90 10, 115 40 C132 60, 120 88, 92 95 C70 101, 46 92, 44 72"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M44 72 L35 88 L55 86"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkleDoodle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className}>
      <path
        d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z"
        fill="currentColor"
      />
    </svg>
  );
}

function StarBurst({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className}>
      <g stroke="currentColor" strokeWidth="6" strokeLinecap="round">
        <line x1="50" y1="10" x2="50" y2="90" />
        <line x1="10" y1="50" x2="90" y2="50" />
        <line x1="20" y1="20" x2="80" y2="80" />
        <line x1="80" y1="20" x2="20" y2="80" />
      </g>
    </svg>
  );
}


function Squiggle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 40" className={className}>
      <path
        d="M0 20 Q25 0 50 20 T100 20 T150 20 T200 20"
        stroke="currentColor"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function App() {
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const isValid = selected.type === "application/pdf" || selected.name.endsWith(".tex");
    if (!isValid) {
      setError("Only PDF or .tex files are allowed.");
      setFile(null);
      return;
    }

    setError(null);
    setFile(selected);
    setFeedback(null);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!file) {
      setError("Please select a file before submitting.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setFeedback(null);

    axios({
      method: "post",
      url: "http://localhost:7293/api/UploadResume",
      data: file,
      headers: { "Content-Type": file.type || "application/octet-stream" },
    })
      .then((res) => setFeedback(res.data))
      .catch(() => setError("Upload failed. Please try again."))
      .finally(() => setIsLoading(false));
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Cute background: gradient + dots */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/50 to-background" />
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.08) 1px, transparent 0)",
          backgroundSize: "18px 18px",
        }}
      />

      {/* Doodles / arrows */}
      <motion.div
        className="absolute left-6 top-10 text-foreground/30"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <DoodleArrow className="h-32 w-32 rotate-[-10deg]" />
      </motion.div>

      <motion.div
        className="absolute right-10 top-20 text-foreground/25"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        <DoodleArrow className="h-28 w-28 rotate-[140deg]" />
      </motion.div>

      <div className="relative z-10 grid place-items-center min-h-screen p-4">
        <div className="w-full max-w-5xl space-y-6">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative text-center space-y-3"
          >
            {/* Main Title */}
            <motion.h1
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="text-4xl md:text-5xl font-bold tracking-tight"
            >
              Help My Resume
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.3 }}
              className="text-muted-foreground text-sm md:text-base"
            >
              Upload your resume and get smart, structured feedback in seconds.
            </motion.p>

            {/* Decorative underline */}
            <motion.div
              animate={{ x: [0, 8, 0] }}
              transition={{ duration: 8, repeat: Infinity }}
              className="flex justify-center"
            >
              <Squiggle className="h-6 w-40 text-primary/30 rotate-[4deg]" />
            </motion.div>
          </motion.div>

          {/* Cute “steps” row */}
          <div className="mx-auto max-w-md flex items-center justify-between text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-muted grid place-items-center">1</span>
              Pick file
            </span>
            <ArrowRight className="h-4 w-4" />
            <span className="inline-flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-muted grid place-items-center">2</span>
              Upload
            </span>
            <ArrowRight className="h-4 w-4" />
            <span className="inline-flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-muted grid place-items-center">3</span>
              Get tips ✨
            </span>
          </div>

          <Card className="max-w-md mx-auto shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UploadCloud className="h-5 w-5" />
                Upload Document
              </CardTitle>
              <CardDescription>PDF or LaTeX (.tex) files only</CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Field>
                  <FieldLabel htmlFor="file">Upload Document</FieldLabel>

                  {/* Hidden input + cute drop zone */}
                  <Input
                    ref={inputRef}
                    id="file"
                    type="file"
                    accept=".pdf,.tex,application/pdf"
                    onChange={handleChange}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className="w-full rounded-xl border border-dashed bg-background/60 p-5 text-left transition hover:bg-background"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-lg bg-muted p-2">
                        <UploadCloud className="h-5 w-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {file ? `Selected: ${file.name}` : "Click to choose a file"}
                        </p>
                      </div>
                    </div>
                  </button>

                  {error && <FieldError>{error}</FieldError>}
                </Field>

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Uploading..." : "Submit ✨"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {feedback && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <TipsSection title="Overall Feedback" items={feedback.overall_feedback} />
              <TipsSection title="Education Tips" items={feedback.education_tips} />
              <TipsSection title="Experience Tips" items={feedback.experience_tips} />
              <TipsSection title="Projects Tips" items={feedback.projects_tips} />
              <TipsSection title="Skills Tips" items={feedback.skills_tips} />
              <TipsSection title="ATS Tips" items={feedback.ats_tips} />
            </div>
          )}
        </div>
      </div>


      {/* Floating Blob - Right Top */}
      <motion.div
        className="absolute -right-24 top-[-40px] text-secondary/10"
        animate={{ y: [0, -10, 0], rotate: [0, -6, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      >
        <SparkleDoodle className="h-64 w-64" />
      </motion.div>

      <motion.div
        className="absolute -top-16 -left-20 text-foreground/10"
        animate={{ rotate: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity }}
      >
        <StarBurst className="h-40 w-40 rotate-[23deg]" />
      </motion.div>

      <motion.div
        className="absolute top-[32%] left-[22%] text-foreground/10"
        animate={{ x: [0, 12, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 11, repeat: Infinity }}
      >
        <Squiggle className="h-24 w-40 rotate-[12deg]" />
      </motion.div>

      <motion.div
        className="absolute top-[14%] left-[58%] text-primary/20"
        animate={{ rotate: [0, 40, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      >
        <SparkleDoodle className="h-10 w-10 rotate-[-18deg]" />
      </motion.div>

      <motion.div
        className="absolute top-[70%] left-[12%] text-secondary/15"
        animate={{ rotate: [0, -20, 0], y: [0, 10, 0] }}
        transition={{ duration: 13, repeat: Infinity }}
      >
        <DoodleArrow className="h-24 w-24 rotate-[140deg]" />
      </motion.div>

      {/* <motion.div
        className="absolute top-[48%] right-[18%] text-foreground/5"
        animate={{ rotate: [0, 25, 0] }}
        transition={{ duration: 18, repeat: Infinity }}
      >
        <StarBurst className="h-72 w-72 rotate-[32deg]" />
      </motion.div> */}
    </div>
  );
}