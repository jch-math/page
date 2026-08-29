import { getPublicContent } from '@lib/site';

export const prerender = true;

export async function GET() {
  return new Response(JSON.stringify({ version: 1, items: await getPublicContent() }, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
