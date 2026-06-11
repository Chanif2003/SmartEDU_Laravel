<?php

namespace App\Services;

use App\Exports\StudentExport;
use App\Imports\StudentImport;
use App\Exports\TeacherExport;
use App\Imports\TeacherImport;
use App\Exports\StaffExport;
use App\Imports\StaffImport;
use App\Exports\SubjectExport;
use App\Imports\SubjectImport;
use App\Exports\SchoolClassExport;
use App\Imports\SchoolClassImport;

use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\UploadedFile;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ImportExportService
{
    /**
     * Handle the import of data from an Excel/CSV file based on type.
     *
     * @param string $type
     * @param UploadedFile $file
     * @param string|null $classId
     * @return array
     */
    public function importData(string $type, UploadedFile $file, ?string $classId = null): array
    {
        try {
            $import = $this->getImportInstance($type, $classId);
            Excel::import($import, $file);

            return [
                'status' => 'success',
                'message' => 'Data ' . $this->getLabel($type) . ' berhasil diimpor.',
            ];
        } catch (\Maatwebsite\Excel\Validators\ValidationException $e) {
            $failures = $e->failures();
            $errors = [];
            foreach ($failures as $failure) {
                $errors[] = "Baris {$failure->row()}: " . implode(', ', $failure->errors());
            }

            Log::warning('Import Validation Failed for ' . $type, ['errors' => $errors]);

            return [
                'status' => 'error',
                'message' => 'Terdapat kesalahan validasi pada file impor.',
                'errors' => $errors,
            ];
        } catch (\Exception $e) {
            Log::error('Import Failed for ' . $type . ': ' . $e->getMessage());

            return [
                'status' => 'error',
                'message' => 'Terjadi kesalahan internal saat memproses file impor.',
            ];
        }
    }

    /**
     * Handle the export of data to an Excel file based on type.
     *
     * @param string $type
     * @param string|null $classId
     * @return BinaryFileResponse
     */
    public function exportData(string $type, ?string $classId = null): BinaryFileResponse
    {
        $fileName = 'data_' . $type . '_' . date('Y_m_d_His') . '.xlsx';
        $export = $this->getExportInstance($type, $classId);
        
        return Excel::download($export, $fileName);
    }

    private function getImportInstance(string $type, ?string $classId)
    {
        return match ($type) {
            'students' => new StudentImport($classId),
            'teachers' => new TeacherImport(),
            'staffs' => new StaffImport(),
            'subjects' => new SubjectImport(),
            'classes' => new SchoolClassImport(),
            default => throw new \Exception('Invalid import type')
        };
    }

    private function getExportInstance(string $type, ?string $classId)
    {
        return match ($type) {
            'students' => new StudentExport($classId),
            'teachers' => new TeacherExport(),
            'staffs' => new StaffExport(),
            'subjects' => new SubjectExport(),
            'classes' => new SchoolClassExport(),
            default => throw new \Exception('Invalid export type')
        };
    }

    private function getLabel(string $type): string
    {
        return match ($type) {
            'students' => 'Siswa',
            'teachers' => 'Guru',
            'staffs' => 'Staf',
            'subjects' => 'Mata Pelajaran',
            'classes' => 'Kelas',
            default => 'Data'
        };
    }
}
