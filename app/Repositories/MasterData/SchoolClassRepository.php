<?php

namespace App\Repositories\MasterData;

use App\Models\SchoolClass;
use App\Repositories\Contracts\SchoolClassRepositoryInterface;

class SchoolClassRepository implements SchoolClassRepositoryInterface
{
    public function getAll()
    {
        return SchoolClass::all();
    }

    public function paginate(int $perPage, array $filters = [])
    {
        $query = SchoolClass::query();
        
        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('grade_level', 'like', '%' . $filters['search'] . '%');
        }

        return $query->latest()->paginate($perPage)->withQueryString();
    }

    public function find(string $id)
    {
        return SchoolClass::findOrFail($id);
    }

    public function create(array $data)
    {
        return SchoolClass::create($data);
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
