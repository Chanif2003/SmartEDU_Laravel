<?php

namespace App\Repositories\MasterData;

use App\Models\TimeSlot;
use App\Repositories\Contracts\TimeSlotRepositoryInterface;

class TimeSlotRepository implements TimeSlotRepositoryInterface
{
    public function paginate(int $perPage, array $filters = [])
    {
        $query = TimeSlot::query();
        
        if (!empty($filters['search'])) {
            $query->where('label', 'like', '%' . $filters['search'] . '%');
        }

        return $query->latest()->paginate($perPage)->withQueryString();
    }

    public function find(string $id)
    {
        return TimeSlot::findOrFail($id);
    }

    public function create(array $data)
    {
        return TimeSlot::create($data);
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
