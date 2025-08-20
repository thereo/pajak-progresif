// /app/api/motors/route.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  const motors = await prisma.motor.findMany();
  return new Response(JSON.stringify(motors));
}

export async function POST(request: Request) {
  const body = await request.json();
  const motor = await prisma.motor.create({
    data: {
      name: body.name,
      type: body.type,
      nilai: Number(body.nilai),
    },
  });
  return new Response(JSON.stringify(motor), { status: 201 });
}
