// src/app/api/generate/route.ts

import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Ensure that you have installed the @google/generative-ai package
// If not, install it using: npm install @google/generative-ai

export async function POST(request: Request) {
  try {
    const { prompt, toolType } = await request.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        {
          error: "Invalid request. 'prompt' is required and must be a string.",
        },
        { status: 400 }
      );
    }

    if (!toolType || typeof toolType !== "string") {
      return NextResponse.json(
        {
          error:
            "Invalid request. 'toolType' is required and must be a string.",
        },
        { status: 400 }
      );
    }

    // Customize the prompt based on the toolType
    let customizedPrompt = "";

    switch (toolType.toLowerCase()) {
      case "tool1":
        customizedPrompt = `Create a comprehensive business plan for a rural entrepreneur in [specific industry, e.g., agriculture, crafts]. The plan should include:
- Executive Summary
- Business Description
- Market Analysis
- Organization and Management
- Products or Services
- Marketing and Sales Strategy
- Funding Request
- Financial Projections

Ensure the plan addresses the unique challenges and opportunities of rural areas and includes actionable steps and realistic financial estimates.`;
        break;
      case "tool2":
        customizedPrompt = `Compose a professional email with the following details:
- Recipient: [Recipient's Name and Email]
- Subject: [Email Subject]
- Purpose: [Purpose of the Email]
- Key Points to Include: [List of Key Points]
- Tone: [Formal/Informal]

Ensure the email is clear, concise, and adheres to professional standards suitable for rural entrepreneurship contexts.`;
        break;
      case "tool3":
        customizedPrompt = `Develop a detailed marketing strategy for a rural business focused on [specific product or service]. The strategy should cover:
- Target Audience Identification
- Unique Selling Proposition (USP)
- Marketing Channels (e.g., social media, local markets, word-of-mouth)
- Promotional Tactics
- Budget Allocation
- Measurement and Evaluation Metrics

Tailor the strategy to leverage local resources and address the specific needs of rural communities.`;
        break;
      case "tool4":
        customizedPrompt = `Create a detailed financial plan for a rural entrepreneur starting a business in [specific industry]. The plan should include:
- Startup Costs Breakdown
- Revenue Projections for the first 3 years
- Expense Forecast (fixed and variable)
- Cash Flow Statement
- Break-even Analysis
- Funding Requirements and Potential Sources

Ensure the financial plan is realistic and considers the economic conditions of rural areas.`;
        break;
      case "tool5":
        customizedPrompt = `Generate a comprehensive market research report for a rural business focused on [specific product or service]. The report should include:
- Industry Overview
- Target Market Analysis
- Competitor Analysis
- SWOT Analysis (Strengths, Weaknesses, Opportunities, Threats)
- Consumer Behavior Insights
- Market Trends
- Recommendations for Market Entry or Expansion

Ensure the report is data-driven and relevant to the rural entrepreneurial context.`;
        break;
      default:
        customizedPrompt = prompt; // Fallback to the original prompt
    }

    // Initialize the Google Generative AI client with your API key
    const apiKey = process.env.GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      console.error(
        "GENERATIVE_AI_API_KEY is not defined in environment variables."
      );
      return NextResponse.json(
        {
          error: "Server configuration error. Please contact support.",
        },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Specify the model you want to use
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content based on the customized prompt
    const result = await model.generateContent(customizedPrompt);

    // Extract the response text
    const responseText = result.response?.text();

    if (!responseText) {
      return NextResponse.json(
        { error: "No response text received from the Generative AI model." },
        { status: 500 }
      );
    }

    // Return the generated text as a JSON response
    return NextResponse.json({ text: responseText }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/generate:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while generating content." },
      { status: 500 }
    );
  }
}
