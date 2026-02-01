export async function GET() {
  return Response.json({ name: 'Ares Control', status: 'ok', ts: new Date().toISOString() });
}
