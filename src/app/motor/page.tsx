'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';

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

  const router = useRouter();

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
    setName('');
    setType('');
    setNilai('');
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
    router.push('/');
  }

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
        <Card className="max-w-sm w-full shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Memuat Data Motor
            </h2>
            <p className="text-sm text-muted-foreground">
              Mohon tunggu sebentar, sedang mengambil data motor Anda...
            </p>
            <div className="mt-6 flex justify-center space-x-1">
              <div className="h-2 w-2 bg-muted rounded-full animate-pulse"></div>
              <div
                className="h-2 w-2 bg-muted rounded-full animate-pulse"
                style={{ animationDelay: '0.2s' }}
              ></div>
              <div
                className="h-2 w-2 bg-muted rounded-full animate-pulse"
                style={{ animationDelay: '0.4s' }}
              ></div>
            </div>
          </CardContent>
        </Card>
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
          <Button
            type="button"
            onClick={navigateToCalculator}
            className="min-h-[44px] px-4 py-3 text-sm font-medium flex items-center justify-center"
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
          </Button>
          <Button
            type="button"
            onClick={openAdd}
            className="min-h-[44px] px-4 py-3 font-medium flex items-center justify-center"
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
          </Button>
        </div>
      </div>

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
              <button
                onClick={() => {
                  setError(null);
                  fetchData();
                }}
                className="mt-3 text-sm font-medium underline"
              >
                Coba Lagi
              </button>
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

      {motors.length === 0 ? (
        <Card className="text-center py-12 sm:py-16 px-6 bg-muted">
          <CardContent className="p-0">
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
            <h3 className="text-xl font-medium text-foreground mb-3">
              Belum ada motor
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
              Mulai dengan menambahkan motor pertama Anda untuk menghitung pajak
              progresif
            </p>
            <Button
              type="button"
              onClick={openAdd}
              className="px-6 py-3 font-medium min-h-[44px] inline-flex items-center justify-center"
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
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
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
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => openEdit(motor)}
                      className="flex-1 min-h-[44px] flex items-center justify-center"
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
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => setDeleteConfirm(motor)}
                      className="flex-1 min-h-[44px] flex items-center justify-center"
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
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                  <TableHead className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                    Nama Motor
                  </TableHead>
                  <TableHead className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                    Tipe
                  </TableHead>
                  <TableHead className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100 text-right">
                    Nilai (Rp)
                  </TableHead>
                  <TableHead className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100 text-center">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {motors.map(motor => (
                  <TableRow
                    key={motor.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <TableCell className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">
                      {motor.name}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {motor.type}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-right font-mono text-gray-900 dark:text-gray-100">
                      {motor.nilai.toLocaleString('id-ID')}
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <div className="flex justify-center space-x-3">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => openEdit(motor)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm"
                          disabled={isDeleting === motor.id}
                        >
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setDeleteConfirm(motor)}
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
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      <Dialog
        open={openModal}
        onOpenChange={isOpen => {
          if (!isOpen) {
            closeModal();
          }
        }}
      >
        <DialogContent className="w-full max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editMotor ? 'Edit Motor' : 'Tambah Motor Baru'}
            </DialogTitle>
          </DialogHeader>
          <form
            id="motor-form"
            className="space-y-5"
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
                  aria-describedby={formErrors.name ? 'name-error' : undefined}
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
                  aria-describedby={formErrors.type ? 'type-error' : undefined}
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
          <DialogFooter className="flex flex-col sm:flex-row justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
              disabled={isSaving}
              aria-label="Batal tambah atau edit motor"
              className="min-h-[44px] order-2 sm:order-1"
            >
              Batal
            </Button>
            <Button
              type="submit"
              form="motor-form"
              disabled={isSaving}
              aria-label={
                editMotor ? 'Update data motor yang ada' : 'Simpan motor baru'
              }
              className="min-h-[44px] order-1 sm:order-2"
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
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleteConfirm}
        onOpenChange={isOpen => {
          if (!isOpen) {
            setDeleteConfirm(null);
          }
        }}
      >
        <DialogContent className="w-full max-w-sm">
          {deleteConfirm && (
            <>
              <DialogHeader>
                <DialogTitle>Konfirmasi Hapus</DialogTitle>
                <DialogDescription>
                  Apakah Anda yakin ingin menghapus motor{' '}
                  <strong>{deleteConfirm.name}</strong>? Tindakan ini tidak
                  dapat dibatalkan.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex flex-col sm:flex-row justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDeleteConfirm(null)}
                  disabled={isDeleting === deleteConfirm.id}
                  aria-label="Batal hapus motor"
                  className="order-2 sm:order-1"
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => deleteMotor(deleteConfirm)}
                  disabled={isDeleting === deleteConfirm.id}
                  aria-label={`Hapus motor ${deleteConfirm.name}`}
                  className="order-1 sm:order-2"
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
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
