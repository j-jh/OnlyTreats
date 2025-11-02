/*
    route: /api/ai-street-summary
    POST API endpoint to generate OpenAI AI API summary of given street or neighborhood
    ---
    Headers:
        Content-Type: application

    Requesty Body: 
    - JSON object for neighborhood summary:
    {
        "neighborhood": "string for SF neighborhood",
        "type": "neighborhood"
    }
    - JSON object for neighborhood summary:
    {     
        "neighborhood": "string for SF neighborhood",
        "street": "string for street in neighborhood",
        "type": "street"
    }

    Behaviors:
    - Get apiKey from .env file
    - Parse param for street or neighborhood request type
    - Prompt for given request type
    - Call OpenAI APi to generate summary
        - temperature: creativity/randomness
        - max_tokens: response length limit 

    Response JSON: 
    - Returns AI gen summary

    Errors:
    - 400: Missing parameter
    - 500: POST request error
*/
import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req) {
    try {
        // type: 'street' or 'neighborhood'
        const { street, neighborhood, type } = await req.json();

        if (!neighborhood || !type) {
            return new Response(
                JSON.stringify({ error: "Missing parameters" }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        let prompt;
        if (type === 'neighborhood') {
            prompt = `${neighborhood}, San Francisco:`;
        } else { // type === 'street'
            prompt = `${street} in ${neighborhood}, San Francisco:`;
        }

        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You're a friendly SF neighborhood expert helping families plan trick-or-treat routes. Be concise and practical." },
                { role: "user", content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 150
        });

        return new Response(
            JSON.stringify({ summary: response.choices[0].message.content }),
            { headers: { "Content-Type": "application/json" } }
        );

    } catch (error) {
        return new Response(
            JSON.stringify({ error: "Failed to generate summary: " + error.message }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}