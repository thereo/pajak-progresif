import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { TaxCalculation } from '@/lib/calculateTax';

interface Motor {
  id: number;
  name: string;
  type: string;
  nilai: number;
}

interface TaxFormProps {
  motors: Motor[];
  motorId: number | null;
  setMotorId: (value: number | null) => void;
  ownership: number;
  setOwnership: (value: number) => void;
  isCalculating: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
  result: TaxCalculation | null;
  error: string | null;
  setError: (value: string | null) => void;
}

export default function TaxForm({
  motors,
  motorId,
  setMotorId,
  ownership,
  setOwnership,
  isCalculating,
  onSubmit,
  onReset,
  result,
  error,
  setError,
}: TaxFormProps) {
  const formRef = useKeyboardNavigation<HTMLFormElement>(
    onReset, // onEscape
    () => onSubmit(new Event('submit') as unknown as React.FormEvent), // onEnter
    undefined, // onTab (default behavior)
    [onReset, onSubmit]
  );

  return (
    <>
      {error && (
        <div
          className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-4 rounded-xl mb-4 flex items-start justify-between shadow-sm"
          role="alert"
          aria-live="polite"
        >
          <div className="flex items-start flex-1 min-w-0">
            <div className="flex-shrink-0 mr-3 mt-0.5">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-red-600 dark:text-red-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-1">
                Terjadi Kesalahan
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 break-words">
                {error}
              </p>
            </div>
          </div>
          <button
            onClick={() => setError(null)}
            className="ml-4 flex-shrink-0 p-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
            aria-label="Tutup pesan error"
          >
            <svg
              className="w-5 h-5 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="space-y-5"
        aria-label="Formulir Perhitungan Pajak Motor"
      >
        <div>
          <label
            htmlFor="motor-select"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Pilih Motor{' '}
            <span className="text-red-500" aria-label="wajib diisi">
              *
            </span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <select
              id="motor-select"
              value={motorId || ''}
              onChange={e =>
                setMotorId(e.target.value ? Number(e.target.value) : null)
              }
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg w-full pl-10 pr-8 py-3 text-base focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent appearance-none touch-manipulation"
              disabled={motors.length === 0}
              aria-describedby={motors.length === 0 ? 'motor-help' : undefined}
              aria-required="true"
              aria-invalid={!motorId}
            >
              <option value="">Pilih motor...</option>
              {motors.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} - {m.type} (Rp {m.nilai.toLocaleString()})
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          {motors.length === 0 && (
            <div className="flex items-center mt-2">
              <svg
                className="w-4 h-4 text-amber-500 mr-1.5 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <p
                id="motor-help"
                className="text-sm text-gray-600 dark:text-gray-400"
              >
                Tidak ada data motor tersedia
              </p>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="ownership-input"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Kepemilikan Ke-{' '}
            <span className="text-red-500" aria-label="wajib diisi">
              *
            </span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <input
              id="ownership-input"
              type="number"
              min={1}
              max={10}
              value={ownership}
              onChange={e => setOwnership(Number(e.target.value))}
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg w-full pl-10 pr-3 py-3 text-base focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent touch-manipulation"
              placeholder="Masukkan urutan kepemilikan (1-10)"
              aria-describedby="ownership-help"
              aria-required="true"
              aria-invalid={ownership < 1}
            />
          </div>
          <div className="flex items-start mt-2">
            <svg
              className="w-4 h-4 text-blue-500 mr-1.5 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <p
              id="ownership-help"
              className="text-sm text-gray-600 dark:text-gray-400"
            >
              Kepemilikan pertama (1) tidak dikenakan pajak, selanjutnya
              dikenakan pajak progresif
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={!motorId || ownership < 1 || isCalculating}
            className="flex-1 bg-black hover:bg-gray-800 active:bg-gray-900 dark:bg-white dark:hover:bg-gray-200 dark:active:bg-gray-300 dark:text-black disabled:bg-gray-400 disabled:cursor-not-allowed text-white dark:text-black rounded-lg py-3 font-medium transition-colors touch-manipulation min-h-[44px] flex items-center justify-center"
            aria-describedby="submit-help"
          >
            {isCalculating ? (
              <>
                <div
                  className="animate-spin rounded-full h-4 w-4 border-b-2 border-white dark:border-black mr-2"
                  aria-hidden="true"
                ></div>
                Menghitung...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                Hitung Pajak
              </>
            )}
          </button>

          {(result || error) && (
            <button
              type="button"
              onClick={onReset}
              className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 active:bg-gray-100 dark:active:bg-gray-700 rounded-lg font-medium transition-colors touch-manipulation min-h-[44px] flex items-center justify-center"
              aria-label="Reset formulir dan hapus hasil perhitungan"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Reset
            </button>
          )}
        </div>

        <div id="submit-help" className="sr-only">
          Klik tombol ini untuk menghitung pajak motor berdasarkan motor yang
          dipilih dan urutan kepemilikan
        </div>
      </form>
    </>
  );
}
