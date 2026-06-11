<?php

namespace App\Repositories\Contracts\Academic;

use App\Models\Attendance;
use Illuminate\Database\Eloquent\Collection;

interface AttendanceRepositoryInterface
{
    public function getByDateAndClass(string $date, string $classId): Collection;
    public function findByScheduleAndDate(string $scheduleId, string $date): ?Attendance;
    public function create(array $data): Attendance;
    public function update(Attendance $attendance, array $data): bool;
}
