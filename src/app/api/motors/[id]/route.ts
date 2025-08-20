// /app/api/motors/[id]/route.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const updated = await prisma.motor.update({
    where: { id: Number(params.id) },
    data: {
      name: body.name,
      type: body.type,
      nilai: Number(body.nilai),
    },
  });
  return new Response(JSON.stringify(updated));
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.motor.delete({ where: { id: Number(params.id) } });
  return new Response(null, { status: 204 });
}
