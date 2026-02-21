# Hackathon AI Resume Helper 2026

## Inspiration
Students entering the job market often struggle to understand why their resumes don’t perform well, especially when applying through ATS systems or for early-career roles. We wanted to build a tool that provides clear, actionable, and structured feedback to help students improve their resumes with confidence.

## How We Built It
We built the frontend using **React** to provide a fast and intuitive user experience. The backend was developed using **Azure Functions (.NET Isolated)**, allowing us to process resume submissions efficiently.

For AI analysis, we integrated **Ollama** running locally and used the **Phi-3 language model** to review resumes and generate structured feedback. The model analyzes resume content and returns targeted suggestions across education, experience, projects, skills, and ATS optimization.

## Challenges We Ran Into
One of the main challenges was handling AI processing time while keeping the application responsive. We also had to ensure that the AI produced consistent and structured feedback rather than free-form text. This required careful prompt design and schema enforcement.

Another challenge was integrating a local AI model with a serverless backend while maintaining clean API boundaries.

## Accomplishments We're Proud Of
- Built a working MVP within a short hackathon timeframe  
- Successfully integrated AI-powered resume analysis  
- Generated structured, actionable feedback tailored for early-career students  
- Designed a clean API that separates resume processing from the frontend  

## What We Learned
We learned how to integrate AI models into real applications, how to control and structure AI output, and how serverless architectures can be used to build scalable backend services. We also gained experience working with Azure Functions and managing AI-driven workflows.

## What's Next
We plan to continue improving the project by:
- Enhancing ATS keyword analysis  
- Adding job-specific resume tailoring  
- Supporting multiple resume versions and comparisons  
- Improving UI feedback and visualization  
- Deploying the system for broader student use  

- Go to the react client folder then run

```
  npm run dev
```

# To run the C# project, you need this local.settings.json file containing:

```
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "dotnet-isolated"
  },
  "Host": {
    "CORS": "http://localhost:5173",
    "CORSCredentials": true
  }
}
```
