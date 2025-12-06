import { TaxCalculation } from '@/lib/calculateTax';

interface TaxResultProps {
  result: TaxCalculation;
}

export default function TaxResult({ result }: TaxResultProps) {
  return (
    <div
      className="mt-6 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4 sm:p-6"
      role="region"
      aria-labelledby="tax-result-title"
      aria-live="polite"
    >
      <div className="flex items-center mb-4">
        <svg
          className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400 mr-2 sm:mr-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2
          id="tax-result-title"
          className="text-base sm:text-lg font-semibold text-green-800 dark:text-green-200"
        >
          Rincian Pajak Motor
        </h2>
      </div>
      <div
        className="space-y-1 sm:space-y-3 text-sm"
        role="table"
        aria-label="Detail perhitungan pajak motor"
      >
        <div
          className="flex justify-between py-2 sm:py-1 border-b border-green-100 dark:border-green-900"
          role="row"
        >
          <span
            className="text-gray-600 dark:text-gray-400 font-medium"
            role="rowheader"
          >
            Nilai Jual
          </span>
          <span
            className="font-medium text-gray-900 dark:text-gray-100 text-right"
            role="cell"
          >
            Rp {result.nilaiJual.toLocaleString()}
          </span>
        </div>
        <div
          className="flex justify-between py-2 sm:py-1 border-b border-green-100 dark:border-green-900"
          role="row"
        >
          <span
            className="text-gray-600 dark:text-gray-400 font-medium"
            role="rowheader"
          >
            BBNKB
          </span>
          <span
            className="font-medium text-gray-900 dark:text-gray-100 text-right"
            role="cell"
          >
            Rp {result.bbnkb.toLocaleString()}
          </span>
        </div>
        <div
          className="flex justify-between py-2 sm:py-1 border-b border-green-100 dark:border-green-900"
          role="row"
        >
          <span
            className="text-gray-600 dark:text-gray-400 font-medium"
            role="rowheader"
          >
            Tarif PKB
          </span>
          <span
            className="font-medium text-gray-900 dark:text-gray-100 text-right"
            role="cell"
          >
            {result.tarifPkb}%
          </span>
        </div>
        <div
          className="flex justify-between py-2 sm:py-1 border-b border-green-100 dark:border-green-900"
          role="row"
        >
          <span
            className="text-gray-600 dark:text-gray-400 font-medium"
            role="rowheader"
          >
            PKB
          </span>
          <span
            className="font-medium text-gray-900 dark:text-gray-100 text-right"
            role="cell"
          >
            Rp {result.pkb.toLocaleString()}
          </span>
        </div>
        <div
          className="flex justify-between py-2 sm:py-1 border-b border-green-100 dark:border-green-900"
          role="row"
        >
          <span
            className="text-gray-600 dark:text-gray-400 font-medium"
            role="rowheader"
          >
            Pajak Progresif
          </span>
          <span
            className="font-medium text-gray-900 dark:text-gray-100 text-right"
            role="cell"
          >
            Rp {result.pajakProgresif.toLocaleString()}
          </span>
        </div>
        <div
          className="flex justify-between py-2 sm:py-1 border-b border-green-100 dark:border-green-900"
          role="row"
        >
          <span
            className="text-gray-600 dark:text-gray-400 font-medium"
            role="rowheader"
          >
            SWDKLLJ
          </span>
          <span
            className="font-medium text-gray-900 dark:text-gray-100 text-right"
            role="cell"
          >
            Rp {result.swdkljj.toLocaleString()}
          </span>
        </div>
        <div
          className="flex justify-between py-2 sm:py-1 border-b border-green-100 dark:border-green-900"
          role="row"
        >
          <span
            className="text-gray-600 dark:text-gray-400 font-medium"
            role="rowheader"
          >
            Biaya Adm STNK
          </span>
          <span
            className="font-medium text-gray-900 dark:text-gray-100 text-right"
            role="cell"
          >
            Rp {result.biayaAdmStnk.toLocaleString()}
          </span>
        </div>
        <div
          className="flex justify-between py-2 sm:py-1 border-b border-green-100 dark:border-green-900"
          role="row"
        >
          <span
            className="text-gray-600 dark:text-gray-400 font-medium"
            role="rowheader"
          >
            Biaya Adm TNKB
          </span>
          <span
            className="font-medium text-gray-900 dark:text-gray-100 text-right"
            role="cell"
          >
            Rp {result.biayaAdmTnkb.toLocaleString()}
          </span>
        </div>
        <div className="border-t-2 border-green-300 dark:border-green-700 my-2 sm:my-2"></div>
        <div
          className="flex justify-between py-3 sm:py-2 bg-green-100 dark:bg-green-900 rounded-lg px-3 sm:px-0 sm:bg-transparent sm:dark:bg-transparent sm:rounded-none"
          role="row"
          aria-live="assertive"
        >
          <span
            className="text-base sm:text-lg font-bold text-green-800 dark:text-green-200"
            role="rowheader"
          >
            Total Pajak
          </span>
          <span
            className="text-base sm:text-lg font-bold text-green-800 dark:text-green-200 text-right"
            role="cell"
          >
            Rp {result.totalPajak.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
