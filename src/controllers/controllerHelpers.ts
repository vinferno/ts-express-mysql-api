
import { Response } from 'express';
export function catchErrorHelper(err: Error|unknown,res: Response) {
    let message = 'Internal Server Error'
    if (err instanceof Error) {
        message = err.message
    }
    res.status(500).json({ error: message});

}