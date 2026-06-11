<?php

namespace App\Repositories\Admin\Academic;

use App\Models\TeacherAdministration;
use App\Repositories\Contracts\Admin\Academic\TeacherAdministrationRepositoryInterface;

class TeacherAdministrationRepository implements TeacherAdministrationRepositoryInterface
{
    public function getAllPaginated(int $perPage = 10, array $filters = [])
    {
        $query = TeacherAdministration::with(['teacher.user', 'semester', 'subject'])->latest();
        
        if (!empty($filters['teacher_id'])) {
            $query->where('teacher_id', $filters['teacher_id']);
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function create(array $data)
    {
        return TeacherAdministration::create($data);
    }

    public function findById(string $id)
    {
        return TeacherAdministration::findOrFail($id);
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
