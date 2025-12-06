interface TaxInfoPanelProps {
  className?: string;
}

export default function TaxInfoPanel({ className = '' }: TaxInfoPanelProps) {
  return (
    <div
      className={`bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 sm:p-5 mb-6 ${className}`}
      role="region"
      aria-labelledby="info-panel-title"
    >
      <h3
        id="info-panel-title"
        className="text-base sm:text-sm font-semibold text-blue-800 dark:text-blue-200 mb-3 sm:mb-3 flex items-center"
      >
        <svg
          className="w-5 h-5 sm:w-4 sm:h-4 mr-2 sm:mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
        Keterangan Perhitungan Pajak
      </h3>
      <div
        className="text-sm sm:text-sm text-blue-700 dark:text-blue-300 space-y-3 sm:space-y-2"
        role="list"
      >
        <div className="flex items-start" role="listitem">
          <span
            className="inline-block w-2.5 h-2.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full mt-1.5 mr-3 flex-shrink-0"
            aria-hidden="true"
          ></span>
          <span className="leading-relaxed">
            Perhitungan ini hanya khusus wilayah <strong>DKI Jakarta</strong>
          </span>
        </div>
        <div className="flex items-start" role="listitem">
          <span
            className="inline-block w-2.5 h-2.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full mt-1.5 mr-3 flex-shrink-0"
            aria-hidden="true"
          ></span>
          <span className="leading-relaxed">
            <strong>Nilai Jual</strong> kendaraan diambil dari website{' '}
            <a
              href="https://samsat-pkb.jakarta.go.id/INFO_NJKB"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
              aria-label="Kunjungi website SAMSAT DKI Jakarta untuk informasi NJKB"
            >
              samsat-pkb.jakarta.go.id/INFO_NJKB
            </a>
          </span>
        </div>
        <div className="flex items-start" role="listitem">
          <span
            className="inline-block w-2.5 h-2.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full mt-1.5 mr-3 flex-shrink-0"
            aria-hidden="true"
          ></span>
          <span className="leading-relaxed">
            <strong>BBNKB</strong> 12.5% dari harga jual yang ada di notice STNK
          </span>
        </div>
        <div className="flex items-start" role="listitem">
          <span
            className="inline-block w-2.5 h-2.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full mt-1.5 mr-3 flex-shrink-0"
            aria-hidden="true"
          ></span>
          <span className="leading-relaxed">
            <strong>PKB</strong> kepemilikan ke-1 tarif 16%, ke-2 dan seterusnya
            tarif bertambah 8%
          </span>
        </div>
        <div className="flex items-start" role="listitem">
          <span
            className="inline-block w-2.5 h-2.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full mt-1.5 mr-3 flex-shrink-0"
            aria-hidden="true"
          ></span>
          <span className="leading-relaxed">
            <strong>Pajak Progresif</strong> = selisih PKB motor saat ini dengan
            motor pertama
          </span>
        </div>
      </div>
    </div>
  );
}
