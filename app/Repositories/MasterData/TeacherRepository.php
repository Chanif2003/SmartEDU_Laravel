<?php

namespace App\Repositories\MasterData;

use App\Models\Teacher;
use App\Repositories\Contracts\TeacherRepositoryInterface;

class TeacherRepository implements TeacherRepositoryInterface
{
    public function paginate(int $perPage, array $filters = [])
    {
        $query = Teacher::query();
        
        if (!empty($filters['search'])) {
            $query->where('nama_lengkap', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('nip', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('nuptk', 'like', '%' . $filters['search'] . '%');
        }

        return $query->latest()->paginate($perPage)->withQueryString();
    }

    public function find(string $id)
    {
        return Teacher::findOrFail($id);
    }

    public function create(array $data)
    {
        return Teacher::create($data);
    }

    public function update(string $id, array $data)
    {
        $model = $this->find($id);
        $model->update($data);
        return $model;
    }

    public function delete(string $id)
    {
        $model = $this->find($id);
        return $model->delete();
    }
}
