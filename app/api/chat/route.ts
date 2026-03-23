import OpenAI from "openai";

const client = new OpenAI({
apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
const { messages } = await req.json();

const stream = await client.chat.completions.create({
model: "gpt-4o-mini",
messages,
stream: true,
});

return new Response(stream.toReadableStream());
}