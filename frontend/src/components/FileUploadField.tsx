"use client"

import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import axios from "axios"

export default function FileUploadForm() {
    const [error, setError] = useState<string | null>(null)
    const [file, setFile] = useState<File | null>(null)
    const [isLoading, setIsLoading] = useState(false)

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
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()

        if (!file) {
            setError("Please select a file before submitting.")
            return
        }

        console.log("Submitting file:", file)
        setIsLoading(true)

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
            })
            .catch(err => {
                console.error("Upload failed:", err)
                setError("Upload failed. Please try again.")
            })
            .finally(() => setIsLoading(false));
    }

    return (
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
    )
}