import "./App.css"
import FileUploadField from "./components/FileUploadField"
import { MoveRight } from 'lucide-react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

export default function App() {
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
          <FileUploadField />
        </CardContent>
      </Card>
      <MoveRight className="absolute top-110 w-12 h-12 rotate-270" size={170} color="green" strokeWidth={2.4} />
      <h3> Upload Resume </h3>


    </div>

  )
}