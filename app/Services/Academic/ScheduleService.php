<?php

namespace App\Services\Academic;

use App\Repositories\Academic\ScheduleRepository;
use App\Models\Schedule;
use Illuminate\Validation\ValidationException;

class ScheduleService
{
    protected $repository;

    public function __construct(ScheduleRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getAllSchedules($filters = [])
    {
        return $this->repository->getAll($filters);
    }

    public function createSchedule(array $data)
    {
        // Validasi overlap sudah di-handle oleh database composite unique key, 
        // tapi kita bisa memberikan pesan error yang lebih human-readable dengan mengeceknya dulu.
        
        $teacherConflict = Schedule::where('semester_id', $data['semester_id'])
            ->where('day', $data['day'])
            ->where('time_slot_id', $data['time_slot_id'])
            ->where('teacher_id', $data['teacher_id'])
            ->first();

        if ($teacherConflict) {
            throw ValidationException::withMessages([
                'teacher_id' => 'Guru tersebut sudah memiliki jadwal mengajar di slot waktu dan hari yang sama.'
            ]);
        }

        $classConflict = Schedule::where('semester_id', $data['semester_id'])
            ->where('day', $data['day'])
            ->where('time_slot_id', $data['time_slot_id'])
            ->where('class_id', $data['class_id'])
            ->first();

        if ($classConflict) {
            throw ValidationException::withMessages([
                'class_id' => 'Kelas tersebut sudah memiliki mata pelajaran lain di slot waktu dan hari yang sama.'
            ]);
        }

        return $this->repository->create($data);
    }

    public function deleteSchedule($id)
    {
        return $this->repository->delete($id);
    }
}
