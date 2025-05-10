import path from 'path';
import { promises as fs } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const file = await fs.readFile(process.cwd() + '/data/data.json', 'utf-8');
    const data = JSON.parse(file);

    res.status(200).json(data);
}