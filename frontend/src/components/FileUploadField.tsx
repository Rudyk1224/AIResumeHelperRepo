"use client"

import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function FileUploadForm() {
    const [error, setError] = useState<string | null>(null)
    const [file, setFile] = useState<File | null>(null)

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

        // TODO: send to API / server action
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

            <Button variant="outline" type="submit">Submit</Button>
        </form>
    )
}