import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }  // note Promise
) {
  const { id } = await context.params; // await the params
  const body = await request.json();

  const updated = await prisma.motor.update({
    where: { id: Number(id) },
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
  context: { params: Promise<{ id: string }> }  // note Promise
) {
  const { id } = await context.params;
  await prisma.motor.delete({ where: { id: Number(id) } });
  return new NextResponse(null, { status: 204 });
}
