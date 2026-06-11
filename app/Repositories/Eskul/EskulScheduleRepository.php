<?php

namespace App\Repositories\Eskul;

use App\Models\EskulSchedule;

class EskulScheduleRepository
{
    public function getAll()
    {
        return EskulSchedule::with(['extracurricular', 'semester'])->get();
    }

    public function findById($id)
    {
        return EskulSchedule::findOrFail($id);
    }

    public function create(array $data)
    {
        return EskulSchedule::create($data);
    }

    public function update($id, array $data)
    {
        $schedule = $this->findById($id);
        $schedule->update($data);
        return $schedule;
    }

    public function delete($id)
    {
        $schedule = $this->findById($id);
        return $schedule->delete();
    }
}
