import serverless from 'serverless-http';
import { createApp } from '../src/main';

export const config = {
  runtime: 'nodejs18.x',
};

let handler: any = null;

export default async function (req: any, res: any) {
  try {
    if (!handler) {
      console.log('Initializing Nest app for Vercel function');
      const nestApp = await createApp();
      const expressApp = nestApp.getHttpAdapter().getInstance();
      handler = serverless(expressApp);
      console.log('Nest function handler created');
    }

    return handler(req, res);
  } catch (error: any) {
    console.error('Vercel function initialization failed:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      error: 'Server initialization failed',
      message: error?.message || 'Unknown error',
      stack: error?.stack,
    }));
    return undefined;
  }
}
