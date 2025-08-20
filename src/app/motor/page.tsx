"use client";

import { useEffect, useState } from "react";

interface Motor {
  id: number;
  name: string;
  type: string;
  nilai: number;
}

interface FormErrors {
  name?: string;
  type?: string;
  nilai?: string;
}

export default function MotorPage() {
  const [motors, setMotors] = useState<Motor[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editMotor, setEditMotor] = useState<Motor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Motor | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [nilai, setNilai] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
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
      setError("Gagal memuat data motor. Silakan refresh halaman.");
    } finally {
      setIsLoading(false);
    }
  }

  function validateForm(): boolean {
    const errors: FormErrors = {};

    if (!name.trim()) {
      errors.name = "Nama motor harus diisi";
    } else if (name.trim().length < 2) {
      errors.name = "Nama motor minimal 2 karakter";
    }

    if (!type.trim()) {
      errors.type = "Tipe motor harus diisi";
    } else if (type.trim().length < 2) {
      errors.type = "Tipe motor minimal 2 karakter";
    }

    const nilaiNum = Number(nilai);
    if (!nilai || nilaiNum <= 0) {
      errors.nilai = "Nilai harus lebih dari 0";
    } else if (nilaiNum > 1000000000) {
      errors.nilai = "Nilai terlalu besar";
    }

    // Check for duplicate names (except when editing)
    const isDuplicate = motors.some(m => 
      m.name.toLowerCase() === name.trim().toLowerCase() && 
      m.id !== editMotor?.id
    );
    if (isDuplicate) {
      errors.name = "Nama motor sudah ada";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function openAdd() {
    setName("");
    setType("");
    setNilai("");
    setEditMotor(null);
    setFormErrors({});
    setOpenModal(true);
  }

  function openEdit(motor: Motor) {
    setName(motor.name);
    setType(motor.type);
    setNilai(motor.nilai.toString());
    setEditMotor(motor);
    setFormErrors({});
    setOpenModal(true);
  }

  function closeModal() {
    setOpenModal(false);
    setFormErrors({});
  }

  async function saveMotor() {
    if (!validateForm()) {
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const payload = { 
        name: name.trim(), 
        type: type.trim(), 
        nilai: Number(nilai) 
      };

      let res;
      if (editMotor) {
        res = await fetch(`/api/motors/${editMotor.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/motors", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      await fetchData();
      closeModal();
    } catch (err) {
      console.error("Save error:", err);
      setError(`Gagal ${editMotor ? 'mengupdate' : 'menambah'} motor: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteMotor(motor: Motor) {
    try {
      setIsDeleting(motor.id);
      setError(null);

      const res = await fetch(`/api/motors/${motor.id}`, { 
        method: "DELETE" 
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }

      await fetchData();
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Delete error:", err);
      setError(`Gagal menghapus motor: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsDeleting(null);
    }
  }

  function navigateToCalculator() {
    window.location.href = "/";
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto p-4">
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
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Kelola Motor</h1>
        <div className="flex space-x-3">
          <button
            onClick={navigateToCalculator}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2 text-sm font-medium transition-colors"
          >
            Kalkulator Pajak
          </button>
          <button
            className="bg-black hover:bg-gray-800 text-white rounded-md px-4 py-2 font-medium transition-colors"
            onClick={openAdd}
          >
            + Tambah Motor
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
          <p className="text-sm">{error}</p>
          <button 
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800 text-sm underline mt-1"
          >
            Tutup
          </button>
        </div>
      )}

      {motors.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-2v13M9 19c0 1.1-.9 2-2 2s-2-.9-2-2s.9-2 2-2s2 .9 2 2zm12-2c0 1.1-.9 2-2 2s-2-.9-2-2s.9-2 2-2s2 .9 2 2zM9 10l12-2" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada motor</h3>
          <p className="text-gray-500 mb-4">Mulai dengan menambahkan motor pertama Anda</p>
          <button
            onClick={openAdd}
            className="bg-black hover:bg-gray-800 text-white rounded-md px-6 py-2 font-medium transition-colors"
          >
            Tambah Motor Pertama
          </button>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Nama Motor</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Tipe</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">Nilai (Rp)</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {motors.map((motor) => (
                <tr key={motor.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{motor.name}</td>
                  <td className="py-3 px-4 text-gray-600">{motor.type}</td>
                  <td className="py-3 px-4 text-right font-mono text-gray-900">
                    {motor.nilai.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={() => openEdit(motor)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        disabled={isDeleting === motor.id}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(motor)}
                        className="text-red-600 hover:text-red-800 font-medium text-sm"
                        disabled={isDeleting === motor.id}
                      >
                        {isDeleting === motor.id ? (
                          <span className="flex items-center">
                            <div className="animate-spin rounded-full h-3 w-3 border-b border-red-600 mr-1"></div>
                            Hapus...
                          </span>
                        ) : (
                          'Hapus'
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {editMotor ? "Edit Motor" : "Tambah Motor Baru"}
              </h2>
            </div>
            
            <div className="px-6 py-4 space-y-4">
              <div>
                <label htmlFor="motor-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Motor
                </label>
                <input
                  id="motor-name"
                  className={`border rounded-md w-full p-3 focus:ring-2 focus:ring-black focus:border-transparent ${
                    formErrors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Contoh: Honda Vario 125"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isSaving}
                />
                {formErrors.name && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="motor-type" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipe Motor
                </label>
                <input
                  id="motor-type"
                  className={`border rounded-md w-full p-3 focus:ring-2 focus:ring-black focus:border-transparent ${
                    formErrors.type ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Contoh: Scooter Matic"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  disabled={isSaving}
                />
                {formErrors.type && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.type}</p>
                )}
              </div>

              <div>
                <label htmlFor="motor-nilai" className="block text-sm font-medium text-gray-700 mb-1">
                  Nilai Motor (Rupiah)
                </label>
                <input
                  id="motor-nilai"
                  type="number"
                  min="1"
                  max="1000000000"
                  className={`border rounded-md w-full p-3 focus:ring-2 focus:ring-black focus:border-transparent ${
                    formErrors.nilai ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Contoh: 18000000"
                  value={nilai}
                  onChange={(e) => setNilai(e.target.value)}
                  disabled={isSaving}
                />
                {formErrors.nilai && (
                  <p className="text-red-600 text-sm mt-1">{formErrors.nilai}</p>
                )}
                {nilai && Number(nilai) > 0 && (
                  <p className="text-gray-500 text-sm mt-1">
                    Rp {Number(nilai).toLocaleString('id-ID')}
                  </p>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                className="border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md px-4 py-2 font-medium transition-colors"
                onClick={closeModal}
                disabled={isSaving}
              >
                Batal
              </button>
              <button
                className="bg-black hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-md px-6 py-2 font-medium transition-colors"
                onClick={saveMotor}
                disabled={isSaving}
              >
                {isSaving ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {editMotor ? 'Mengupdate...' : 'Menyimpan...'}
                  </span>
                ) : (
                  editMotor ? 'Update Motor' : 'Simpan Motor'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-sm">
            <div className="px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Konfirmasi Hapus
              </h3>
              <p className="text-gray-600 mb-4">
                Apakah Anda yakin ingin menghapus motor <strong>{deleteConfirm.name}</strong>? 
                Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md px-4 py-2 font-medium transition-colors"
                  disabled={isDeleting === deleteConfirm.id}
                >
                  Batal
                </button>
                <button
                  onClick={() => deleteMotor(deleteConfirm)}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white rounded-md px-4 py-2 font-medium transition-colors"
                  disabled={isDeleting === deleteConfirm.id}
                >
                  {isDeleting === deleteConfirm.id ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Menghapus...
                    </span>
                  ) : (
                    'Ya, Hapus'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}