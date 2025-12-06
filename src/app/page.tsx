'use client';
import { useState, useEffect } from 'react';
import { calculateTax, TaxCalculation } from '@/lib/calculateTax';
import Link from 'next/link';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import TaxInfoPanel from '@/components/TaxInfoPanel';
import TaxForm from '@/components/TaxForm';
import TaxResult from '@/components/TaxResult';
import Footer from '@/components/Footer';
import ScreenReaderAnnouncement from '@/components/ScreenReaderAnnouncement';

interface Motor {
  id: number;
  name: string;
  type: string;
  nilai: number;
}

export default function Page() {
  const [motors, setMotors] = useState<Motor[]>([]);
  const [motorId, setMotorId] = useState<number | null>(null);
  const [ownership, setOwnership] = useState<number>(1);
  const [result, setResult] = useState<TaxCalculation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState<string | null>(null);

  const navigateToMotorManagement = () => {
    window.location.href = '/motor';
  };

  const pageRef = useKeyboardNavigation<HTMLDivElement>(
    undefined, // onEscape
    undefined, // onEnter
    undefined, // onTab
    [navigateToMotorManagement]
  );

  useEffect(() => {
    const fetchMotors = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch('/api/motors');

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setMotors(data);
      } catch (err) {
        console.error('Failed to fetch motors:', err);
        setError('Gagal memuat data motor. Silakan coba lagi.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchMotors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!motorId) {
      setError('Silakan pilih motor terlebih dahulu.');
      return;
    }

    if (ownership < 1) {
      setError('Kepemilikan harus minimal 1.');
      return;
    }

    try {
      setIsCalculating(true);
      setError(null);
      setResult(null);

      const motor = motors.find(m => m.id === motorId);
      if (!motor) {
        throw new Error('Motor tidak ditemukan.');
      }

      const calc = calculateTax(motor.nilai, ownership);
      setResult(calc);
      setAnnouncement(
        `Perhitungan pajak selesai. Total pajak: Rp ${calc.totalPajak.toLocaleString('id-ID')}`
      );
    } catch (err) {
      console.error('Calculation error:', err);
      setError('Gagal menghitung pajak. Silakan coba lagi.');
      setAnnouncement('Gagal menghitung pajak. Silakan coba lagi.');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setMotorId(null);
    setOwnership(1);
    setResult(null);
    setError(null);
    setAnnouncement('Form telah direset');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-sm w-full">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Memuat Data Motor
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Mohon tunggu sebentar, sedang mengambil data motor Anda...
            </p>
            <div className="mt-6 flex justify-center space-x-1">
              <div className="h-2 w-2 bg-gray-300 rounded-full animate-pulse"></div>
              <div
                className="h-2 w-2 bg-gray-300 rounded-full animate-pulse"
                style={{ animationDelay: '0.2s' }}
              ></div>
              <div
                className="h-2 w-2 bg-gray-300 rounded-full animate-pulse"
                style={{ animationDelay: '0.4s' }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="max-w-xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8">
      <ScreenReaderAnnouncement message={announcement} priority="polite" />
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            Hitung Pajak Motor
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Kalkulator pajak progresif untuk kendaraan bermotor di DKI Jakarta
          </p>
        </div>
        <Link
          href="/motor"
          className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg px-4 py-3 text-sm font-medium transition-colors touch-manipulation min-h-[44px] flex items-center justify-center self-start"
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              navigateToMotorManagement();
            }
          }}
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
              d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
            />
          </svg>
          Kelola Motor
        </Link>
      </div>

      <TaxInfoPanel />

      <TaxForm
        motors={motors}
        motorId={motorId}
        setMotorId={setMotorId}
        ownership={ownership}
        setOwnership={setOwnership}
        isCalculating={isCalculating}
        onSubmit={handleSubmit}
        onReset={handleReset}
        result={result}
        error={error}
        setError={setError}
      />

      {result && <TaxResult result={result} />}

      {motors.length === 0 && !isLoading && (
        <div className="mt-6 text-center py-12 sm:py-16 bg-gray-50 dark:bg-gray-800 rounded-lg px-6">
          <div className="text-gray-400 dark:text-gray-500 mb-6">
            <svg
              className="mx-auto h-16 w-16 sm:h-20 sm:w-20"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Belum Ada Data Motor
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
            Tambahkan data motor terlebih dahulu untuk dapat menghitung pajak
            progresif.
          </p>
          <Link
            href="/motor"
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg px-6 py-3 text-sm font-medium transition-colors touch-manipulation min-h-[44px] inline-flex items-center justify-center"
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Tambah Motor Baru
          </Link>
        </div>
      )}

      <Footer />
    </div>
  );
}
