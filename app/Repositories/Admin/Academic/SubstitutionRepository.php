<?php

namespace App\Repositories\Admin\Academic;

use App\Models\Substitution;
use App\Repositories\Contracts\Admin\Academic\SubstitutionRepositoryInterface;

class SubstitutionRepository implements SubstitutionRepositoryInterface
{
    public function getAllPaginated(int $perPage = 10, array $filters = [])
    {
        $query = Substitution::with(['originalTeacher.user', 'substituteTeacher.user', 'schedule.subject', 'schedule.schoolClass'])->latest();
        
        if (!empty($filters['teacher_id'])) {
            $query->where(function($q) use ($filters) {
                $q->where('original_teacher_id', $filters['teacher_id'])
                  ->orWhere('substitute_teacher_id', $filters['teacher_id']);
            });
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function create(array $data)
    {
        return Substitution::create($data);
    }

    public function findById(string $id)
    {
        return Substitution::findOrFail($id);
    }

    public function update(string $id, array $data)
    {
        $record = $this->findById($id);
        $record->update($data);
        return $record;
    }

    public function delete(string $id)
    {
        $record = $this->findById($id);
        return $record->delete();
    }
}
