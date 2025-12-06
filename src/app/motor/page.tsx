'use client';

import { useEffect, useState } from 'react';
import {
  useKeyboardNavigation,
  useFocusTrap,
} from '@/hooks/useKeyboardNavigation';

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
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [nilai, setNilai] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [triggerElement, setTriggerElement] = useState<HTMLElement | null>(
    null
  );

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
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
      setError('Gagal memuat data motor. Silakan refresh halaman.');
    } finally {
      setIsLoading(false);
    }
  }

  function validateForm(): boolean {
    const errors: FormErrors = {};

    if (!name.trim()) {
      errors.name = 'Nama motor harus diisi';
    } else if (name.trim().length < 2) {
      errors.name = 'Nama motor minimal 2 karakter';
    }

    if (!type.trim()) {
      errors.type = 'Tipe motor harus diisi';
    } else if (type.trim().length < 2) {
      errors.type = 'Tipe motor minimal 2 karakter';
    }

    const nilaiNum = Number(nilai);
    if (!nilai || nilaiNum <= 0) {
      errors.nilai = 'Nilai harus lebih dari 0';
    } else if (nilaiNum > 1000000000) {
      errors.nilai = 'Nilai terlalu besar';
    }

    // Check for duplicate names (except when editing)
    const isDuplicate = motors.some(
      m =>
        m.name.toLowerCase() === name.trim().toLowerCase() &&
        m.id !== editMotor?.id
    );
    if (isDuplicate) {
      errors.name = 'Nama motor sudah ada';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function openAdd() {
    setTriggerElement(document.activeElement as HTMLElement);
    setName('');
    setType('');
    setNilai('');
    setEditMotor(null);
    setFormErrors({});
    setOpenModal(true);
  }

  function openEdit(motor: Motor) {
    setTriggerElement(document.activeElement as HTMLElement);
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
    // Restore focus to the trigger element
    if (triggerElement) {
      triggerElement.focus();
      setTriggerElement(null);
    }
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
        nilai: Number(nilai),
      };

      let res;
      if (editMotor) {
        res = await fetch(`/api/motors/${editMotor.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/motors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${res.status}`
        );
      }

      await fetchData();
      closeModal();
    } catch (err) {
      console.error('Save error:', err);
      setError(
        `Gagal ${editMotor ? 'mengupdate' : 'menambah'} motor: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function deleteMotor(motor: Motor) {
    try {
      setIsDeleting(motor.id);
      setError(null);

      const res = await fetch(`/api/motors/${motor.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${res.status}`
        );
      }

      await fetchData();
      setDeleteConfirm(null);
      // Restore focus to the trigger element
      if (triggerElement) {
        triggerElement.focus();
        setTriggerElement(null);
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError(
        `Gagal menghapus motor: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
    } finally {
      setIsDeleting(null);
    }
  }

  function navigateToCalculator() {
    window.location.href = '/';
  }

  // Focus trap for modals
  const modalRef = useFocusTrap<HTMLDivElement>(!!openModal);
  const deleteModalRef = useFocusTrap<HTMLDivElement>(!!deleteConfirm);

  // Keyboard navigation for the page
  const pageRef = useKeyboardNavigation<HTMLDivElement>(
    undefined, // onEscape
    undefined, // onEnter
    undefined, // onTab
    [navigateToCalculator]
  );

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
    <div ref={pageRef} className="max-w-6xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col gap-3">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            Kelola Motor
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Tambah, edit, atau hapus data motor Anda
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button
            onClick={navigateToCalculator}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigateToCalculator();
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-lg px-4 py-3 text-sm font-medium transition-colors touch-manipulation min-h-[44px] flex items-center justify-center"
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
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
            Kalkulator Pajak
          </button>
          <button
            className="bg-black hover:bg-gray-800 active:bg-gray-900 text-white rounded-lg px-4 py-3 font-medium transition-colors touch-manipulation min-h-[44px] flex items-center justify-center"
            onClick={openAdd}
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
            Tambah Motor
          </button>
        </div>
      </div>

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
              <button
                onClick={() => setError(null)}
                className="mt-3 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 underline"
              >
                Coba Lagi
              </button>
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

      {motors.length === 0 ? (
        <div className="text-center py-12 sm:py-16 bg-gray-50 dark:bg-gray-800 rounded-lg px-6">
          <div className="text-gray-400 dark:text-gray-500 mb-6">
            <svg
              className="mx-auto h-16 w-16 sm:h-20 sm:w-20"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19V6l12-2v13M9 19c0 1.1-.9 2-2 2s-2-.9-2-2s.9-2 2-2s2 .9 2 2zm12-2c0 1.1-.9 2-2 2s-2-.9-2-2s.9-2 2-2s2 .9 2 2zM9 10l12-2"
              />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-3">
            Belum ada motor
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
            Mulai dengan menambahkan motor pertama Anda untuk menghitung pajak
            progresif
          </p>
          <button
            onClick={openAdd}
            className="bg-black hover:bg-gray-800 active:bg-gray-900 dark:bg-white dark:hover:bg-gray-200 dark:active:bg-gray-300 dark:text-black text-white dark:text-black rounded-lg px-6 py-3 font-medium transition-colors touch-manipulation min-h-[44px] inline-flex items-center justify-center"
          >
            <svg
              className="w-5 h-5 mr-2"
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
            Tambah Motor Pertama
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
          {/* Mobile Card View */}
          <div className="block md:hidden">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {motors.map(motor => (
                <div
                  key={motor.id}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0 pr-3">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg truncate mb-1">
                        {motor.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <svg
                          className="w-4 h-4 mr-1.5 flex-shrink-0"
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
                        {motor.type}
                      </div>
                      <div className="flex items-center text-lg font-semibold text-gray-900 dark:text-gray-100">
                        <svg
                          className="w-5 h-5 mr-1.5 flex-shrink-0 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        Rp {motor.nilai.toLocaleString('id-ID')}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => openEdit(motor)}
                      className="flex-1 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-800 active:bg-blue-200 dark:active:bg-blue-700 px-4 py-3 rounded-lg font-medium text-sm transition-colors touch-manipulation min-h-[44px] flex items-center justify-center"
                      disabled={isDeleting === motor.id}
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        setTriggerElement(
                          document.activeElement as HTMLElement
                        );
                        setDeleteConfirm(motor);
                      }}
                      className="flex-1 bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800 active:bg-red-200 dark:active:bg-red-700 px-4 py-3 rounded-lg font-medium text-sm transition-colors touch-manipulation min-h-[44px] flex items-center justify-center"
                      disabled={isDeleting === motor.id}
                    >
                      {isDeleting === motor.id ? (
                        <span className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b border-red-600 dark:border-red-400 mr-2"></div>
                          Menghapus...
                        </span>
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Hapus
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                    Nama Motor
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                    Tipe
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                    Nilai (Rp)
                  </th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {motors.map(motor => (
                  <tr
                    key={motor.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                      {motor.name}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {motor.type}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-gray-900 dark:text-gray-100">
                      {motor.nilai.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center space-x-3">
                        <button
                          onClick={() => openEdit(motor)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm"
                          disabled={isDeleting === motor.id}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setTriggerElement(
                              document.activeElement as HTMLElement
                            );
                            setDeleteConfirm(motor);
                          }}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 font-medium text-sm"
                          disabled={isDeleting === motor.id}
                        >
                          {isDeleting === motor.id ? (
                            <span className="flex items-center">
                              <div className="animate-spin rounded-full h-3 w-3 border-b border-red-600 dark:border-red-400 mr-1"></div>
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
        </div>
      )}

      {/* Add/Edit Modal */}
      {openModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            ref={modalRef}
            className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl"
          >
            <div className="px-4 sm:px-6 py-5 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
              <div className="flex items-center justify-between">
                <h2
                  id="modal-title"
                  className="text-lg font-semibold text-gray-900 dark:text-gray-100"
                >
                  {editMotor ? 'Edit Motor' : 'Tambah Motor Baru'}
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Tutup modal"
                >
                  <svg
                    className="w-5 h-5"
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
            </div>

            <form
              id="motor-form"
              className="px-4 sm:px-6 py-5 space-y-5"
              onSubmit={e => {
                e.preventDefault();
                saveMotor();
              }}
            >
              <div>
                <label
                  htmlFor="motor-name"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Nama Motor{' '}
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
                  <input
                    id="motor-name"
                    className={`border rounded-lg w-full pl-10 pr-3 py-3 text-base focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 touch-manipulation ${
                      formErrors.name
                        ? 'border-red-300 dark:border-red-600'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Contoh: Honda Vario 125"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    disabled={isSaving}
                    aria-required="true"
                    aria-invalid={!!formErrors.name}
                    aria-describedby={
                      formErrors.name ? 'name-error' : undefined
                    }
                  />
                </div>
                {formErrors.name && (
                  <div className="flex items-center mt-2">
                    <svg
                      className="w-4 h-4 text-red-500 mr-1.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p
                      id="name-error"
                      className="text-red-600 dark:text-red-400 text-sm"
                      role="alert"
                    >
                      {formErrors.name}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="motor-type"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Tipe Motor{' '}
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
                  <input
                    id="motor-type"
                    className={`border rounded-lg w-full pl-10 pr-3 py-3 text-base focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 touch-manipulation ${
                      formErrors.type
                        ? 'border-red-300 dark:border-red-600'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Contoh: Scooter Matic"
                    value={type}
                    onChange={e => setType(e.target.value)}
                    disabled={isSaving}
                    aria-required="true"
                    aria-invalid={!!formErrors.type}
                    aria-describedby={
                      formErrors.type ? 'type-error' : undefined
                    }
                  />
                </div>
                {formErrors.type && (
                  <div className="flex items-center mt-2">
                    <svg
                      className="w-4 h-4 text-red-500 mr-1.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p
                      id="type-error"
                      className="text-red-600 dark:text-red-400 text-sm"
                      role="alert"
                    >
                      {formErrors.type}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="motor-nilai"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Nilai Motor (Rupiah){' '}
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
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <input
                    id="motor-nilai"
                    type="number"
                    inputMode="numeric"
                    min="1"
                    max="1000000000"
                    className={`border rounded-lg w-full pl-10 pr-3 py-3 text-base focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 touch-manipulation ${
                      formErrors.nilai
                        ? 'border-red-300 dark:border-red-600'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    placeholder="Contoh: 18000000"
                    value={nilai}
                    onChange={e => setNilai(e.target.value)}
                    disabled={isSaving}
                    aria-required="true"
                    aria-invalid={!!formErrors.nilai}
                    aria-describedby={
                      formErrors.nilai ? 'nilai-error' : 'nilai-help'
                    }
                  />
                </div>
                {formErrors.nilai && (
                  <div className="flex items-center mt-2">
                    <svg
                      className="w-4 h-4 text-red-500 mr-1.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p
                      id="nilai-error"
                      className="text-red-600 dark:text-red-400 text-sm"
                      role="alert"
                    >
                      {formErrors.nilai}
                    </p>
                  </div>
                )}
                {nilai && Number(nilai) > 0 && (
                  <div className="flex items-center mt-2">
                    <svg
                      className="w-4 h-4 text-green-500 mr-1.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p
                      id="nilai-help"
                      className="text-gray-600 dark:text-gray-400 text-sm font-medium"
                    >
                      Rp {Number(nilai).toLocaleString('id-ID')}
                    </p>
                  </div>
                )}
              </div>
            </form>

            <div className="px-4 sm:px-6 py-5 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-end gap-3 sticky bottom-0 bg-white dark:bg-gray-800">
              <button
                type="button"
                className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 active:bg-gray-100 dark:active:bg-gray-600 rounded-lg px-4 py-3 font-medium transition-colors order-2 sm:order-1 touch-manipulation min-h-[44px] flex items-center justify-center"
                onClick={closeModal}
                disabled={isSaving}
                aria-label="Batal tambah atau edit motor"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Batal
              </button>
              <button
                type="submit"
                form="motor-form"
                className="w-full sm:w-auto bg-black hover:bg-gray-800 active:bg-gray-900 dark:bg-white dark:hover:bg-gray-200 dark:active:bg-gray-300 disabled:bg-gray-400 disabled:cursor-not-allowed text-white dark:text-black rounded-lg px-6 py-3 font-medium transition-colors order-1 sm:order-2 touch-manipulation min-h-[44px] flex items-center justify-center"
                disabled={isSaving}
                aria-label={
                  editMotor ? 'Update data motor yang ada' : 'Simpan motor baru'
                }
              >
                {isSaving ? (
                  <>
                    <div
                      className="animate-spin rounded-full h-4 w-4 border-b-2 border-white dark:border-black mr-2"
                      aria-hidden="true"
                    ></div>
                    {editMotor ? 'Mengupdate...' : 'Menyimpan...'}
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {editMotor ? 'Update Motor' : 'Simpan Motor'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-title"
          aria-describedby="delete-description"
        >
          <div
            ref={deleteModalRef}
            className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-sm"
          >
            <div className="px-4 sm:px-6 py-4">
              <h3
                id="delete-title"
                className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2"
              >
                Konfirmasi Hapus
              </h3>
              <p
                id="delete-description"
                className="text-gray-600 dark:text-gray-400 mb-4 text-sm sm:text-base"
              >
                Apakah Anda yakin ingin menghapus motor{' '}
                <strong>{deleteConfirm.name}</strong>? Tindakan ini tidak dapat
                dibatalkan.
              </p>
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={() => {
                    setDeleteConfirm(null);
                    // Restore focus to the trigger element
                    if (triggerElement) {
                      triggerElement.focus();
                      setTriggerElement(null);
                    }
                  }}
                  className="w-full sm:w-auto border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md px-4 py-2 font-medium transition-colors order-2 sm:order-1"
                  disabled={isDeleting === deleteConfirm.id}
                  aria-label="Batal hapus motor"
                >
                  Batal
                </button>
                <button
                  onClick={() => deleteMotor(deleteConfirm)}
                  className="w-full sm:w-auto bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white rounded-md px-4 py-2 font-medium transition-colors order-1 sm:order-2"
                  disabled={isDeleting === deleteConfirm.id}
                  aria-label={`Hapus motor ${deleteConfirm.name}`}
                >
                  {isDeleting === deleteConfirm.id ? (
                    <span className="flex items-center justify-center">
                      <div
                        className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"
                        aria-hidden="true"
                      ></div>
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
