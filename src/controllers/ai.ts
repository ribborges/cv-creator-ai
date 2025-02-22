import { Request, Response } from 'express';
import { HfInference } from '@huggingface/inference';

import { hfToken } from '@/config/env';

const inference = new HfInference(hfToken);
const model = 'google/gemma-2-2b-it';

async function getData(req: Request, res: Response) {
    const { dataString } = req.body;

    const results = await inference.chatCompletion({
        model,
        messages: [
            {
                role: 'user',
                content: `
                Dont answer anything else, just take the input (A curriculum) and format to a
                json using the data provided. Here is the json format (Remove unnused fields):
                {
                    "info": {
                        "name": "string",
                        "title": "string",
                        "email": "string",
                        "phone": "string",
                        "address": "string",
                        "linkedin": "string",
                        "github": "string",
                        "website": "string",
                        "summary": "string"
                    },
                    "education": [
                        {
                            "school": "string",
                            "degree": "string",
                            "field": "string",
                            "location": "string",
                            "start_date": Date(month/year),
                            "end_date": Date(month/year),
                            "details": "string"
                        }
                    ],
                    "experience": [
                        {
                            "company": "string",
                            "position": "string",
                            "location": "string",
                            "start_date": Date(month/year),
                            "end_date": Date(month/year),
                            "details": "string"
                        }
                    ],
                    "certifications": [
                        {
                            "name": "string",
                            "organization": "string"
                        }
                    ],
                    "languages": [
                        {
                            "language": "string",
                            "level": "elementary" | "limited" | "professional" | "full" | "native"
                        }
                    ],
                    "skills": {
                        "hard": [ "string" ],
                        "soft": [ "string" ]
                    },
                    "projects": [
                        {
                            "name": "string",
                            "technologies": "string",
                            "description": "string"
                        }
                    ]
                }
                The data: ${dataString}
                `
            },
        ],
        max_tokens: 2048,
        temperature: 0.7
    });

    if (!results.choices[0].message.content) {
        res.status(400).json({ message: 'No data found' });
        return;
    }

    const converted = results.choices[0].message.content;

    const formatted = converted?.split(/```json|```/)[1];
    if (formatted) {
        const toJson = JSON.parse(formatted);
        res.json({ data: toJson });
        return;
    } else {
        res.status(400).json({ message: 'Failed to format the converted text' });
        return;
    }
}

export { getData };