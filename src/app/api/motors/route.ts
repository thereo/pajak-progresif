// /app/api/motors/route.ts
import { NextResponse } from 'next/server';
import { prisma, sanitizeString, sanitizeNumber } from '@/lib/calculateTax';

export async function GET() {
  try {
    const motors = await prisma.motor.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(motors);
  } catch (error) {
    console.error('Error fetching motors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch motors' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    if (!body.name || !body.type || !body.nilai) {
      return NextResponse.json(
        { error: 'Missing required fields: name, type, nilai' },
        { status: 400 }
      );
    }

    if (typeof body.name !== 'string' || typeof body.type !== 'string') {
      return NextResponse.json(
        { error: 'Name and type must be strings' },
        { status: 400 }
      );
    }

    const nilai = Number(body.nilai);
    if (isNaN(nilai) || nilai <= 0 || nilai > 1000000000) {
      return NextResponse.json(
        { error: 'Nilai must be a positive number less than 1,000,000,000' },
        { status: 400 }
      );
    }

    // Check for duplicate names
    const existingMotor = await prisma.motor.findFirst({
      where: { name: sanitizeString(body.name) },
    });

    if (existingMotor) {
      return NextResponse.json(
        { error: 'Motor with this name already exists' },
        { status: 409 }
      );
    }

    const motor = await prisma.motor.create({
      data: {
        name: sanitizeString(body.name),
        type: sanitizeString(body.type),
        nilai: sanitizeNumber(nilai),
      },
    });

    return NextResponse.json(motor, { status: 201 });
  } catch (error) {
    console.error('Error creating motor:', error);
    return NextResponse.json(
      { error: 'Failed to create motor' },
      { status: 500 }
    );
  }
}
