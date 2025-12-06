import { NextRequest, NextResponse } from 'next/server';
import { prisma, sanitizeString, sanitizeNumber } from '@/lib/calculateTax';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // note Promise
) {
  try {
    const { id } = await context.params; // await the params
    const motorId = Number(id);

    if (isNaN(motorId) || motorId <= 0) {
      return NextResponse.json({ error: 'Invalid motor ID' }, { status: 400 });
    }

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

    // Check if motor exists
    const existingMotor = await prisma.motor.findUnique({
      where: { id: motorId },
    });

    if (!existingMotor) {
      return NextResponse.json({ error: 'Motor not found' }, { status: 404 });
    }

    // Check for duplicate names (excluding current motor)
    const duplicateMotor = await prisma.motor.findFirst({
      where: {
        name: sanitizeString(body.name),
        id: { not: motorId },
      },
    });

    if (duplicateMotor) {
      return NextResponse.json(
        { error: 'Motor with this name already exists' },
        { status: 409 }
      );
    }

    const updated = await prisma.motor.update({
      where: { id: motorId },
      data: {
        name: sanitizeString(body.name),
        type: sanitizeString(body.type),
        nilai: sanitizeNumber(nilai),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating motor:', error);
    return NextResponse.json(
      { error: 'Failed to update motor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // note Promise
) {
  try {
    const { id } = await context.params;
    const motorId = Number(id);

    if (isNaN(motorId) || motorId <= 0) {
      return NextResponse.json({ error: 'Invalid motor ID' }, { status: 400 });
    }

    // Check if motor exists
    const existingMotor = await prisma.motor.findUnique({
      where: { id: motorId },
    });

    if (!existingMotor) {
      return NextResponse.json({ error: 'Motor not found' }, { status: 404 });
    }

    await prisma.motor.delete({ where: { id: motorId } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting motor:', error);
    return NextResponse.json(
      { error: 'Failed to delete motor' },
      { status: 500 }
    );
  }
}
