import express, { Request, Response } from 'express';
import cors from 'cors';

const PORT = 5000;
const RATE_LIMIT = 50; 

const app = express();
app.use(cors());
app.use(express.json());


const rateLimitMiddleware = (() => {
  let requestCount = 0;
  let resetTime = Date.now();

  return (req: Request, res: Response, next: () => void) => {
    const currentTime = Date.now();

    if (currentTime - resetTime >= 1000) {
      requestCount = 0;
      resetTime = currentTime;
    }

    if (requestCount >= RATE_LIMIT) {
      return res.status(429).json({ error: 'Too many requests - try again later.' });
    }

    requestCount++;
    next();
  };
})();

app.post('/api', rateLimitMiddleware, (req: Request, res: Response) => {
  const { index } = req.body;

  const delay = Math.floor(Math.random() * 1000) + 1;

  setTimeout(() => {
    res.json({ index });
  }, delay);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
