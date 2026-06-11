<?php

namespace App\Repositories\Academic;

use App\Models\Attendance;
use App\Repositories\Contracts\Academic\AttendanceRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class AttendanceRepository implements AttendanceRepositoryInterface
{
    public function getByDateAndClass(string $date, string $classId): Collection
    {
        return Attendance::with(['schedule', 'schoolClass', 'subject', 'teacher'])
            ->where('date', $date)
            ->where('class_id', $classId)
            ->get();
    }

    public function findByScheduleAndDate(string $scheduleId, string $date): ?Attendance
    {
        return Attendance::where('schedule_id', $scheduleId)
            ->where('date', $date)
            ->first();
    }

    public function create(array $data): Attendance
    {
        return Attendance::create($data);
    }

    public function update(Attendance $attendance, array $data): bool
    {
        return $attendance->update($data);
    }
}
