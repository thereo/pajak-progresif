import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { TaxCalculation } from '@/lib/calculateTax';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
        <Alert
          variant="destructive"
          className="mb-4 flex items-start justify-between gap-3"
        >
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="mt-0.5">
              <svg
                className="w-5 h-5"
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
            </div>
            <div className="flex-1 min-w-0">
              <AlertTitle>Terjadi Kesalahan</AlertTitle>
              <AlertDescription className="break-words">
                {error}
              </AlertDescription>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setError(null)}
            aria-label="Tutup pesan error"
          >
            <svg
              className="w-4 h-4"
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
          </Button>
        </Alert>
      )}

      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="space-y-5"
        aria-label="Formulir Perhitungan Pajak Motor"
      >
        <div>
          <Label htmlFor="motor-select" className="mb-2">
            Pilih Motor{' '}
            <span className="text-red-500" aria-label="wajib diisi">
              *
            </span>
          </Label>
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
          <Label htmlFor="ownership-input" className="mb-2">
            Kepemilikan Ke-{' '}
            <span className="text-red-500" aria-label="wajib diisi">
              *
            </span>
          </Label>
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
            <Input
              id="ownership-input"
              type="number"
              min={1}
              max={10}
              value={ownership}
              onChange={e => setOwnership(Number(e.target.value))}
              className="pl-10"
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
          <Button
            type="submit"
            disabled={!motorId || ownership < 1 || isCalculating}
            className="flex-1 min-h-[44px] flex items-center justify-center"
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
          </Button>

          {(result || error) && (
            <Button
              type="button"
              variant="outline"
              onClick={onReset}
              className="min-h-[44px] flex items-center justify-center"
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
            </Button>
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
