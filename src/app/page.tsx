"use client";
import { useState, useEffect } from "react";
import { calculateTax, TaxCalculation } from "@/lib/calculateTax";
import Link from "next/link";

interface Motor {
  id: number;
  name: string;
  type: string;
  nilai: number;
}

interface ApiError {
  message: string;
}

export default function Page() {
  const [motors, setMotors] = useState<Motor[]>([]);
  const [motorId, setMotorId] = useState<number | null>(null);
  const [ownership, setOwnership] = useState<number>(1);
  const [result, setResult] = useState<TaxCalculation | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMotors = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch("/api/motors");
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        setMotors(data);
      } catch (err) {
        console.error("Failed to fetch motors:", err);
        setError("Gagal memuat data motor. Silakan coba lagi.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMotors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!motorId) {
      setError("Silakan pilih motor terlebih dahulu.");
      return;
    }

    if (ownership < 1) {
      setError("Kepemilikan harus minimal 1.");
      return;
    }

    try {
      setIsCalculating(true);
      setError(null);
      setResult(null);

      const motor = motors.find((m) => m.id === motorId);
      if (!motor) {
        throw new Error("Motor tidak ditemukan.");
      }

      const calc = calculateTax(motor.nilai, ownership);
      setResult(calc);
    } catch (err) {
      console.error("Calculation error:", err);
      setError("Gagal menghitung pajak. Silakan coba lagi.");
    } finally {
      setIsCalculating(false);
    }
  };

  const handleReset = () => {
    setMotorId(null);
    setOwnership(1);
    setResult(null);
    setError(null);
  };

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-2"></div>
            <p className="text-gray-600">Memuat data motor...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Hitung Pajak Motor</h1>
        <Link
          href="/motor"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Kelola Motor
        </Link>
      </div>

      {/* Information Panel */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          Keterangan Perhitungan Pajak
        </h3>
        <div className="text-sm text-blue-700 space-y-2">
          <div className="flex items-start">
            <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
            <span>Perhitungan ini hanya khusus wilayah <strong>DKI Jakarta</strong></span>
          </div>
          <div className="flex items-start">
            <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
            <span><strong>Nilai Jual</strong> kendaraan diambil dari website <a href="https://samsat-pkb.jakarta.go.id/INFO_NJKB" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800">samsat-pkb.jakarta.go.id/INFO_NJKB</a></span>
          </div>
          <div className="flex items-start">
            <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
            <span><strong>BBNKB</strong> 12.5% dari harga jual yang ada di notice STNK</span>
          </div>
          <div className="flex items-start">
            <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
            <span><strong>PKB</strong> kepemilikan ke-1 tarif 16%, ke-2 dan seterusnya tarif bertambah 8%</span>
          </div>
          <div className="flex items-start">
            <span className="inline-block w-2 h-2 bg-blue-400 rounded-full mt-1.5 mr-3 flex-shrink-0"></span>
            <span><strong>Pajak Progresif</strong> = selisih PKB motor saat ini dengan motor pertama</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <p className="text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="motor-select" className="block text-sm font-medium text-gray-700 mb-1">
            Pilih Motor
          </label>
          <select
            id="motor-select"
            value={motorId || ""}
            onChange={(e) => setMotorId(e.target.value ? Number(e.target.value) : null)}
            className="border border-gray-300 rounded-md w-full p-3 focus:ring-2 focus:ring-black focus:border-transparent"
            disabled={motors.length === 0}
          >
            <option value="">Pilih motor...</option>
            {motors.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} - {m.type} (Rp {m.nilai.toLocaleString()})
              </option>
            ))}
          </select>
          {motors.length === 0 && (
            <p className="text-sm text-gray-500 mt-1">Tidak ada data motor tersedia</p>
          )}
        </div>

        <div>
          <label htmlFor="ownership-input" className="block text-sm font-medium text-gray-700 mb-1">
            Kepemilikan Ke-
          </label>
          <input
            id="ownership-input"
            type="number"
            min={1}
            max={10}
            value={ownership}
            onChange={(e) => setOwnership(Number(e.target.value))}
            className="border border-gray-300 rounded-md w-full p-3 focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Masukkan urutan kepemilikan (1-10)"
          />
          <p className="text-sm text-gray-500 mt-1">
            Kepemilikan pertama (1) tidak dikenakan pajak, selanjutnya dikenakan pajak progresif
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={!motorId || ownership < 1 || isCalculating}
            className="flex-1 bg-black hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md py-3 font-medium transition-colors"
          >
            {isCalculating ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Menghitung...
              </span>
            ) : (
              "Hitung Pajak"
            )}
          </button>
          
          {(result || error) && (
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md font-medium transition-colors"
            >
              Reset
            </button>
          )}
        </div>
      </form>

      {result && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-green-800 mb-4">Rincian Pajak Motor</h2>
          <div className="grid gap-3 text-sm">
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Nilai Jual:</span>
              <span className="font-medium">Rp {result.nilaiJual.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-600">BBNKB:</span>
              <span className="font-medium">Rp {result.bbnkb.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Tarif PKB:</span>
              <span className="font-medium">{result.tarifPkb}%</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-600">PKB:</span>
              <span className="font-medium">Rp {result.pkb.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Pajak Progresif:</span>
              <span className="font-medium">Rp {result.pajakProgresif.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-600">SWDKLLJ:</span>
              <span className="font-medium">Rp {result.swdkljj.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Biaya Adm STNK:</span>
              <span className="font-medium">Rp {result.biayaAdmStnk.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-gray-600">Biaya Adm TNKB:</span>
              <span className="font-medium">Rp {result.biayaAdmTnkb.toLocaleString()}</span>
            </div>
            <hr className="border-green-300 my-2" />
            <div className="flex justify-between py-2 text-lg font-bold text-green-800">
              <span>Total Pajak:</span>
              <span>Rp {result.totalPajak.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {motors.length === 0 && !isLoading && (
        <div className="mt-6 text-center py-8 text-gray-500">
          <p className="mb-3">Belum ada data motor tersedia.</p>
          <Link
            href="/motor"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Tambah Motor Baru
          </Link>
        </div>
        
      )}
{/* Footer with GitHub Link */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="text-center text-sm text-gray-600">
          <p className="mb-2">Kalkulator Pajak Motor Jakarta</p>
          <div className="flex items-center justify-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
            </svg>
            <span>Dibuat dengan ❤️ oleh</span>
            <a 
              href="https://github.com/thereo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 font-medium underline"
            >
              @thereo
            </a>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Source code tersedia di GitHub
          </p>
        </div>
      </div>
    </div>
  );
}