import OpenAI from "openai";
import path from 'path';
import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';

const apiKey = process.env.OPEN_AI_KEY;
const openai = new OpenAI({ apiKey });

interface Product {
    Title: string;
    "Variant SKU": string;
    "Variant Price": string;
}

export async function POST(req: Request) {
    const { question } = await req.json();
    const fileContents = await fs.readFile('./public/data.json', 'utf-8');
    const products = JSON.parse(fileContents);

    const productText = (products as Product[]).map((p) =>
        `Title: ${p["Title"]}, SKU: ${p["Variant SKU"]}, Price: $${p["Variant Price"]}`
    ).join('\n');

    // Send to OpenAI
    const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    max_tokens: 300,
    messages: [
        {
        role: "system",
        content: `You are a helpful product assistant. When giving responses, don't say anything extra other than providing the products. Don't list the SKUs, just the name and the price. Display the items in a list format. Be consistent with every response, separating new items with new lines. Here's the product catalog:\n${productText}`,
        },
        {
        role: "user",
        content: question,
        },
    ],
    });

    return NextResponse.json({ reply: response.choices[0].message.content });
}
