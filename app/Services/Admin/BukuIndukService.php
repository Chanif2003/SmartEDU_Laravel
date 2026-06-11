<?php

namespace App\Services\Admin;

use App\Repositories\Contracts\Admin\BukuIndukRepositoryInterface;
use App\Models\Student;

class BukuIndukService
{
    public function __construct(
        protected BukuIndukRepositoryInterface $bukuIndukRepo
    ) {}

    /**
     * Get paginated data for index.
     */
    public function getPaginatedList(array $filters, int $perPage = 15)
    {
        return $this->bukuIndukRepo->getPaginated($perPage, $filters);
    }

    /**
     * Get full aggregated data for a single student.
     */
    public function getStudentBukuInduk(string $id)
    {
        return $this->bukuIndukRepo->getStudentDetail($id);
    }

    /**
     * Update buku induk specific notes/fields.
     */
    public function updateBukuIndukInfo(string $id, array $data)
    {
        $student = Student::findOrFail($id);
        $student->update([
            'registration_type' => $data['registration_type'] ?? $student->registration_type,
            'origin_school' => $data['origin_school'] ?? $student->origin_school,
            'entry_date' => $data['entry_date'] ?? $student->entry_date,
            'entry_semester_id' => $data['entry_semester_id'] ?? $student->entry_semester_id,
            'exit_date' => $data['exit_date'] ?? $student->exit_date,
            'exit_reason' => $data['exit_reason'] ?? $student->exit_reason,
            'notes_buku_induk' => $data['notes_buku_induk'] ?? $student->notes_buku_induk,
        ]);
        return $student;
    }
}
