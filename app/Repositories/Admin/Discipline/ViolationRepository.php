<?php

namespace App\Repositories\Admin\Discipline;

use App\Models\Violation;
use App\Repositories\Contracts\Admin\Discipline\ViolationRepositoryInterface;

class ViolationRepository implements ViolationRepositoryInterface
{
    public function getAllPaginated(int $perPage = 10, array $filters = [])
    {
        $query = Violation::with(['student.user', 'teacher.user'])->latest('date');

        if (!empty($filters['search'])) {
            $query->whereHas('student.user', function ($q) use ($filters) {
                $q->where('name', 'like', '%' . $filters['search'] . '%');
            });
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function getByStudentId(string $studentId, int $perPage = 10)
    {
        return Violation::with(['teacher.user'])
            ->where('student_id', $studentId)
            ->latest('date')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function getTotalPointsByStudentId(string $studentId)
    {
        return Violation::where('student_id', $studentId)->sum('points');
    }

    public function create(array $data)
    {
        return Violation::create($data);
    }

    public function findById(string $id)
    {
        return Violation::findOrFail($id);
    }

    public function update(string $id, array $data)
    {
        $violation = $this->findById($id);
        $violation->update($data);
        return $violation;
    }

    public function delete(string $id)
    {
        $violation = $this->findById($id);
        return $violation->delete();
    }

    public function getStatistics()
    {
        $categoryCounts = \App\Models\Violation::selectRaw('category, count(*) as count')->groupBy('category')->pluck('count', 'category')->toArray();
        $typeCounts = \App\Models\Violation::selectRaw('violation_type, count(*) as count')->groupBy('violation_type')->orderByDesc('count')->limit(5)->pluck('count', 'violation_type')->toArray();

        return [
            'category_distribution' => array_map(function ($k, $v) { return ['name' => ucfirst($k), 'value' => $v]; }, array_keys($categoryCounts), array_values($categoryCounts)),
            'type_distribution' => array_map(function ($k, $v) { return ['name' => $k, 'value' => $v]; }, array_keys($typeCounts), array_values($typeCounts))
        ];
    }
}