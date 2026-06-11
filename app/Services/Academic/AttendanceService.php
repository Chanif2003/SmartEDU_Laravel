<?php

namespace App\Services\Academic;

use App\Models\Schedule;
use App\Repositories\Contracts\Academic\AttendanceRepositoryInterface;

class AttendanceService
{
    public function __construct(
        protected AttendanceRepositoryInterface $attendanceRepo
    ) {}

    public function processAttendance(array $data)
    {
        $scheduleId = $data['schedule_id'];
        $date = $data['date'];
        
        $schedule = Schedule::findOrFail($scheduleId);

        $recordData = [
            'date' => $date,
            'schedule_id' => $scheduleId,
            'class_id' => $schedule->class_id,
            'subject_id' => $schedule->subject_id,
            'teacher_id' => $schedule->teacher_id,
            'records' => $data['records']
        ];

        $attendance = $this->attendanceRepo->findByScheduleAndDate($scheduleId, $date);

        if ($attendance) {
            $this->attendanceRepo->update($attendance, $recordData);
            return $attendance;
        } else {
            return $this->attendanceRepo->create($recordData);
        }
    }
}
