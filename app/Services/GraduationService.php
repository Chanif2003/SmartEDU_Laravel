<?php

namespace App\Services;

use App\Models\Student;
use Illuminate\Support\Facades\DB;
use Exception;

class GraduationService
{
    /**
     * Process bulk graduation for students.
     *
     * @param array $studentIds
     * @param string $graduationDate
     * @param string $graduationYear
     * @return array
     * @throws Exception
     */
    public function bulkGraduate(array $studentIds, string $graduationDate, string $graduationYear)
    {
        try {
            DB::beginTransaction();

            $students = Student::whereIn('id', $studentIds)
                ->where('is_alumni', false) // Only process non-alumni
                ->lockForUpdate() // Prevent concurrent modification
                ->get();

            if ($students->isEmpty()) {
                throw new Exception("Tidak ada data siswa valid yang dapat diproses.");
            }

            // Get the latest SKL number for the year to continue the sequence
            $latestStudent = Student::whereNotNull('skl_number')
                ->where('graduation_year', $graduationYear)
                ->orderBy('skl_number', 'desc')
                ->first();

            $startingSequence = 1;
            if ($latestStudent && preg_match('/SKL\/\d{4}\/(\d{4})/', $latestStudent->skl_number, $matches)) {
                $startingSequence = intval($matches[1]) + 1;
            }

            $count = 0;
            foreach ($students as $student) {
                $sklNumber = sprintf("SKL/%s/%04d", $graduationYear, $startingSequence);

                $student->update([
                    'is_active' => false,
                    'is_alumni' => true,
                    'graduation_date' => $graduationDate,
                    'graduation_year' => $graduationYear,
                    'skl_number' => $sklNumber,
                ]);

                $startingSequence++;
                $count++;
            }

            DB::commit();

            return [
                'status' => 'success',
                'message' => "Berhasil memproses kelulusan untuk {$count} siswa.",
                'count' => $count
            ];
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}
