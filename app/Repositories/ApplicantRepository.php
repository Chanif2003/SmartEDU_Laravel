<?php

namespace App\Repositories;

use App\Models\Applicant;
use App\Repositories\Contracts\ApplicantRepositoryInterface;

class ApplicantRepository implements ApplicantRepositoryInterface
{
    public function paginate(int $perPage, array $filters = [])
    {
        $query = Applicant::with('major')->latest();

        if (!empty($filters['search'])) {
            $query->where(function($q) use ($filters) {
                $q->where('full_name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('registration_number', 'like', '%' . $filters['search'] . '%');
            });
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->paginate($perPage);
    }

    public function find(string $id)
    {
        return Applicant::with('major')->findOrFail($id);
    }

    public function create(array $data)
    {
        return Applicant::create($data);
    }

    public function update(string $id, array $data)
    {
        $applicant = $this->find($id);
        $applicant->update($data);
        return $applicant;
    }

    public function delete(string $id)
    {
        $applicant = $this->find($id);
        return $applicant->delete();
    }

    public function getStatistics()
    {
        $statusCounts = \App\Models\Applicant::selectRaw('status, count(*) as count')->groupBy('status')->pluck('count', 'status')->toArray();
        $majorCounts = \App\Models\Applicant::selectRaw('majors.name as major_name, count(applicants.id) as count')
            ->join('majors', 'applicants.major_id', '=', 'majors.id')
            ->groupBy('majors.id', 'majors.name')
            ->pluck('count', 'major_name')->toArray();

        return [
            'status_distribution' => [
                ['name' => 'Pending', 'value' => $statusCounts['pending'] ?? 0],
                ['name' => 'Direview', 'value' => $statusCounts['reviewed'] ?? 0],
                ['name' => 'Diterima', 'value' => $statusCounts['accepted'] ?? 0],
                ['name' => 'Ditolak', 'value' => $statusCounts['rejected'] ?? 0],
            ],
            'major_distribution' => array_map(function ($k, $v) { return ['name' => $k, 'value' => $v]; }, array_keys($majorCounts), array_values($majorCounts))
        ];
    }

    public function getPendingCount()
    {
        return Applicant::where('status', 'pending')->count();
    }
}
