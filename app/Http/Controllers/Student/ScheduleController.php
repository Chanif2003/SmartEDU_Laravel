<?php
namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Schedule;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    public function index()
    {
        $student = Student::where('user_id', auth()->id())->firstOrFail();
        
        $schedules = Schedule::with(['subject', 'teacher.user', 'timeSlot', 'schoolClass'])
            ->where('class_id', $student->class_id)
            ->get()
            ->groupBy('day')
            ->map(function ($daySchedules) {
                return $daySchedules->sortBy(function($s) {
                    return $s->timeSlot->start_time ?? '00:00:00';
                })->values()->map(function ($s) {
                    $s->start_time = $s->timeSlot->start_time ?? '-';
                    $s->end_time = $s->timeSlot->end_time ?? '-';
                    return $s;
                });
            });

        return Inertia::render('Student/Schedules/Index', [
            'schedules' => $schedules
        ]);
    }
}
