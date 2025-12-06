import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Input sanitization utilities
export function sanitizeString(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function sanitizeNumber(input: string | number): number {
  const num =
    typeof input === 'string'
      ? parseFloat(input.replace(/[^0-9.-]/g, ''))
      : input;
  return isNaN(num) ? 0 : num;
}

export interface TaxCalculation {
  nilaiJual: number;
  bbnkb: number;
  pkb: number;
  swdkljj: number;
  biayaAdmStnk: number;
  biayaAdmTnkb: number;
  pajakProgresif: number;
  totalPajak: number;
  tarifPkb: number;
}

export function calculateTax(
  nilaiJual: number,
  kepemilikanKe: number
): TaxCalculation {
  const bbnkb = nilaiJual * 0.125; // 12.5%

  let tarifPkb: number;
  if (kepemilikanKe === 1) {
    tarifPkb = 0.16;
  } else {
    tarifPkb = 0.16 + 0.08 * (kepemilikanKe - 1);
  }

  const pkb = bbnkb * tarifPkb;
  const pkbMotorPertama = bbnkb * 0.16;
  const pajakProgresif = pkb - pkbMotorPertama;

  const swdkljj = 35000;
  const biayaAdmStnk = 100000;
  const biayaAdmTnkb = 60000;

  const totalPajak = pkb + swdkljj + biayaAdmStnk + biayaAdmTnkb;

  return {
    nilaiJual,
    bbnkb,
    pkb,
    swdkljj,
    biayaAdmStnk,
    biayaAdmTnkb,
    pajakProgresif,
    totalPajak,
    tarifPkb: tarifPkb * 100,
  };
}
