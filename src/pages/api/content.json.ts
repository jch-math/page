import { loadPublicCatalog } from '@lib/content';

export const prerender = true;

export async function GET() {
  const { items } = await loadPublicCatalog();
  return new Response(JSON.stringify({ version: 1, items }, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
