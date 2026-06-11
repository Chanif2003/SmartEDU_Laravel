<?php

namespace App\Repositories\MasterData;

use App\Models\Student;
use App\Repositories\Contracts\StudentRepositoryInterface;

class StudentRepository implements StudentRepositoryInterface
{
    public function paginate(int $perPage, array $filters = [])
    {
        $query = Student::with('schoolClass');
        
        if (!empty($filters['search'])) {
            $query->where('nama_lengkap', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('nis', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('nisn', 'like', '%' . $filters['search'] . '%');
        }

        return $query->latest()->paginate($perPage)->withQueryString();
    }

    public function find(string $id)
    {
        return Student::findOrFail($id);
    }

    public function create(array $data)
    {
        return Student::create($data);
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
