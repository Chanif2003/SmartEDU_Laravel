<?php

namespace App\Repositories\Academic;

use App\Models\Schedule;

class ScheduleRepository
{
    public function getAll($filters = [])
    {
        $query = Schedule::with(['semester', 'timeSlot', 'schoolClass', 'teacher.user', 'subject']);

        if (isset($filters['class_id']) && $filters['class_id']) {
            $query->where('class_id', $filters['class_id']);
        }
        
        if (isset($filters['teacher_id']) && $filters['teacher_id']) {
            $query->where('teacher_id', $filters['teacher_id']);
        }

        return $query->get();
    }

    public function findById($id)
    {
        return Schedule::findOrFail($id);
    }

    public function create(array $data)
    {
        return Schedule::create($data);
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
