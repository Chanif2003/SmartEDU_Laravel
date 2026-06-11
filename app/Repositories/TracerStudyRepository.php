<?php

namespace App\Repositories;

use App\Models\TracerStudy;
use App\Repositories\Contracts\TracerStudyRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\DB;

class TracerStudyRepository implements TracerStudyRepositoryInterface
{
    public function paginate(int $perPage = 10, array $filters = [])
    {
        $query = TracerStudy::with('student');

        if (!empty($filters['graduation_year'])) {
            $query->whereHas('student', function (Builder $q) use ($filters) {
                $q->where('graduation_year', $filters['graduation_year']);
            });
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->latest('entry_year')->paginate($perPage);
    }

    
    public function getYearlyStatistics()
    {
        $data = DB::table('tracer_studies')
            ->join('students', 'tracer_studies.student_id', '=', 'students.id')
            ->select('students.graduation_year', 'tracer_studies.status', DB::raw('count(*) as total'))
            ->whereNotNull('students.graduation_year')
            ->groupBy('students.graduation_year', 'tracer_studies.status')
            ->orderBy('students.graduation_year', 'asc')
            ->get();
            
        $years = [];
        foreach($data as $row) {
            $year = $row->graduation_year;
            if (!isset($years[$year])) {
                $years[$year] = [
                    'year' => (string) $year,
                    'working' => 0,
                    'studying' => 0,
                    'entrepreneur' => 0,
                    'seeking' => 0,
                    'other' => 0
                ];
            }
            $years[$year][$row->status] = (int) $row->total;
        }
        
        return array_values($years);
    }

    public function getStatistics(array $filters = [])
    {
        $query = TracerStudy::query()
            ->select('status', DB::raw('count(*) as total'));

        if (!empty($filters['graduation_year'])) {
            $query->whereHas('student', function (Builder $q) use ($filters) {
                $q->where('graduation_year', $filters['graduation_year']);
            });
        }

        // To get the latest status per student, we could do a subquery or just assume
        // we filter by the latest entry_year or we group by status. For simplicity, 
        // we group by status. In a perfect world, we'd get max(entry_year) per student.
        // Let's get the statistics for the most recent year available or overall.
        return $query->groupBy('status')->get();
    }

    public function findByStudentAndYear(string $studentId, int $year)
    {
        return TracerStudy::where('student_id', $studentId)
            ->where('entry_year', $year)
            ->first();
    }

    public function updateOrCreate(array $attributes, array $values)
    {
        return TracerStudy::updateOrCreate($attributes, $values);
    }
}
