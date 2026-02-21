# UploadResume.ps1
# PowerShell script to upload a PDF to an API endpoint

# --- Configuration ---
$uri = "http://localhost:7293/api/UploadResume"
$filePath = "C:\Users\Ethan\Downloads\978-3-031-14047-1.pdf"

# Check if file exists
if (-Not (Test-Path $filePath)) {
    Write-Error "File not found: $filePath"
    exit 1
}

# --- Prepare headers and file content ---
$headers = @{
    "Content-Type" = "application/pdf"
}

# Read the PDF as binary
$fileBytes = [System.IO.File]::ReadAllBytes($filePath)

# --- Send POST request ---
try {
    $response = Invoke-WebRequest -Uri $uri -Method POST -Headers $headers -Body $fileBytes
    Write-Output "Upload successful! Status code: $($response.StatusCode)"
} catch {
    Write-Error "Upload failed: $_"
}