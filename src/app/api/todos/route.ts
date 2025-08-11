import { db } from '../../../lib/database';

export async function GET() {
  await db.read();
  const todos = db.data?.todos ?? [];
  return Response.json(todos, { status: 200 });
}
