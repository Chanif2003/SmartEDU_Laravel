<?php

namespace App\Repositories\Admin;

use App\Models\Student;
use App\Repositories\Contracts\Admin\BukuIndukRepositoryInterface;

class BukuIndukRepository implements BukuIndukRepositoryInterface
{
    /**
     * Get paginated students for Buku Induk index.
     *
     * @param int $perPage
     * @param array $filters
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */
    public function getPaginated(int $perPage = 15, array $filters = [])
    {
        $query = Student::query()->with(['schoolClass']);

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                  ->orWhere('nisn', 'like', "%{$search}%")
                  ->orWhere('nis', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['status'])) {
            if ($filters['status'] === 'aktif') {
                $query->where('is_active', true)->where('is_alumni', false);
            } elseif ($filters['status'] === 'lulus') {
                $query->where('is_alumni', true);
            } elseif ($filters['status'] === 'mutasi') {
                $query->whereNotNull('exit_reason')->where('is_alumni', false);
            }
        }

        if (!empty($filters['class_id'])) {
            $query->where('class_id', $filters['class_id']);
        }

        return $query->orderBy('nama_lengkap', 'asc')->paginate($perPage);
    }

    /**
     * Get a student by ID with all related data needed for Buku Induk.
     *
     * @param string $id
     * @return \App\Models\Student
     */
    public function getStudentDetail(string $id)
    {
        $student = Student::with([
            'schoolClass',
            'reportCardScores.subject',
            'reportCardScores.semester',
            'violations',
            'tracerStudies',
            'applicant'
        ])->findOrFail($id);

        $attendances = \App\Models\Attendance::whereJsonContains('records', ['student_id' => $id])->get();
        $student->setAttribute('student_attendances', $attendances);

        return $student;
    }
}
