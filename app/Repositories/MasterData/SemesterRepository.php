<?php

namespace App\Repositories\MasterData;

use App\Models\Semester;
use App\Repositories\Contracts\SemesterRepositoryInterface;

class SemesterRepository implements SemesterRepositoryInterface
{
    public function paginate(int $perPage, array $filters = [])
    {
        $query = Semester::query();
        
        if (!empty($filters['search'])) {
            $query->where('name', 'like', '%' . $filters['search'] . '%');
        }

        return $query->latest()->paginate($perPage)->withQueryString();
    }

    public function getAll()
    {
        return Semester::all();
    }

    public function find(string $id)
    {
        return Semester::findOrFail($id);
    }

    public function create(array $data)
    {
        return Semester::create($data);
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
