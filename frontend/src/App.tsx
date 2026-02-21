
"use client";

import "./App.css"
import { MoveRight } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import axios from "axios"

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
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
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



export default function App() {
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState<FeedbackResponse | null>(null);


  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (!selected) return

    const isValid =
      selected.type === "application/pdf" ||
      selected.name.endsWith(".tex")

    if (!isValid) {
      setError("Only PDF or .tex files are allowed.")
      setFile(null)
      return
    }

    setError(null)
    setFile(selected)
    setFeedback(null)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!file) {
      setError("Please select a file before submitting.")
      return
    }

    console.log("Submitting file:", file)
    setIsLoading(true);
    setError(null);
    setFeedback(null);

    axios({
      method: "post",
      url: "http://localhost:7293/api/UploadResume",
      data: file,
      headers: {
        "Content-Type": file.type || "application/octet-stream",
      },
    })
      .then(res => {
        console.log("Upload successful:", res.data)

        setFeedback(res.data);
      })
      .catch(err => {
        console.error("Upload failed:", err)
        setError("Upload failed. Please try again.")
      })
      .finally(() => setIsLoading(false));
  }

  return (
    <div className="grid place-items-center h-screen bg-muted">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Upload Document</CardTitle>
          <CardDescription>
            PDF or LaTeX (.tex) files only
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field>
              <FieldLabel htmlFor="file">Upload Document</FieldLabel>

              <Input
                id="file"
                type="file"
                accept=".pdf,.tex,application/pdf"
                onChange={handleChange}
              />

              {error && <FieldError>{error}</FieldError>}
            </Field>

            <Button variant="outline" type="submit" disabled={isLoading}>
              {isLoading ? "Uploading..." : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {feedback && (
        <div className="space-y-3">
          <TipsSection title="Overall Feedback" items={feedback.overall_feedback} />
          <TipsSection title="Education Tips" items={feedback.education_tips} />
          <TipsSection title="Experience Tips" items={feedback.experience_tips} />
          <TipsSection title="Projects Tips" items={feedback.projects_tips} />
          <TipsSection title="Skills Tips" items={feedback.skills_tips} />
          <TipsSection title="ATS Tips" items={feedback.ats_tips} />
        </div>
      )}
    </div>

  )
}