// /app/api/motors/[id]/route.ts
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
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

  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await prisma.motor.delete({ where: { id: Number(params.id) } });
  return new NextResponse(null, { status: 204 });
}
