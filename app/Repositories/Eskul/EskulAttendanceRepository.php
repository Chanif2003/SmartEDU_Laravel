<?php

namespace App\Repositories\Eskul;

use App\Models\EskulAttendance;

class EskulAttendanceRepository
{
    public function getAll()
    {
        return EskulAttendance::with(['extracurricular', 'schedule', 'coach'])->get();
    }

    public function create(array $data)
    {
        return EskulAttendance::create($data);
    }
}
