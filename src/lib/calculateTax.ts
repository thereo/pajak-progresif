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
