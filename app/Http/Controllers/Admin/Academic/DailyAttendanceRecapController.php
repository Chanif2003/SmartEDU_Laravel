<?php

namespace App\Http\Controllers\Admin\Academic;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\SchoolClass;
use App\Models\Schedule;
use App\Models\Attendance;
use App\Models\Subject;
use App\Models\Student;
use Carbon\Carbon;

class DailyAttendanceRecapController extends Controller
{
    public function index(Request $request)
    {
        $date = $request->input('date', now()->toDateString());
        $classId = $request->input('class_id');
        $subjectId = $request->input('subject_id');
        
        $user = auth()->user();
        $isAdmin = $user->role === 'admin';
        $isTeacher = $user->role === 'teacher';
        $teacherId = $isTeacher ? $user->teacherProfile->id ?? null : null;

        $classesQuery = SchoolClass::orderBy('grade_level')->orderBy('name');

        if ($isTeacher && $teacherId) {
            $teacherClassIds = Schedule::where('teacher_id', $teacherId)->pluck('class_id');
            $classesQuery->whereIn('id', $teacherClassIds);
        }

        $classes = $classesQuery->get();

        if (!$classId && $classes->isNotEmpty()) {
            $classId = $classes->first()->id;
        }

        $subjects = collect();
        if ($classId) {
            $subjectIdsQuery = Schedule::where('class_id', $classId);
            if ($isTeacher && $teacherId) {
                $subjectIdsQuery->where('teacher_id', $teacherId);
            }
            $subjectIds = $subjectIdsQuery->pluck('subject_id')->unique();
            $subjects = Subject::whereIn('id', $subjectIds)->orderBy('name')->get();
        }

        if (!$subjectId && $subjects->isNotEmpty()) {
            $subjectId = $subjects->first()->id;
        }

        // DAILY RECAP DATA (Only for Admin)
        $dailySchedules = collect();
        $dailyAttendances = collect();
        $dailyStudents = collect();

        if ($isAdmin && $classId) {
            $dayName = Carbon::parse($date)->locale('id')->isoFormat('dddd');
            $dailySchedules = Schedule::with(['subject', 'teacher.user', 'timeSlot'])
                ->where('class_id', $classId)
                ->where('day', $dayName)
                ->orderBy('time_slot_id')
                ->get();

            $scheduleIds = $dailySchedules->pluck('id')->toArray();
            $dailyStudents = Student::with('user')->where('class_id', $classId)->orderBy('nama_lengkap')->get();

            if (!empty($scheduleIds)) {
                $dailyAttendances = Attendance::where('date', $date)
                    ->whereIn('schedule_id', $scheduleIds)
                    ->get()
                    ->keyBy('schedule_id');
            }
        }

        // SEMESTER RECAP DATA (For Admin and Teacher)
        $semesterAttendances = collect();
        $semesterDates = collect();
        $semesterStudents = collect();

        if ($classId && $subjectId) {
            $semesterStudents = Student::with('user')->where('class_id', $classId)->orderBy('nama_lengkap')->get();
            
            $query = Attendance::with('schedule')
                ->where('class_id', $classId)
                ->where('subject_id', $subjectId)
                ->orderBy('date', 'asc');
                
            if ($isTeacher && $teacherId) {
                $query->where('teacher_id', $teacherId);
            }
            
            $allAttendances = $query->get();
            $semesterDates = collect($allAttendances->pluck('date'))->map(function($date) {
                return is_string($date) ? Carbon::parse($date)->format('Y-m-d') : $date->format('Y-m-d');
            })->unique()->values();
            
            // Group by formatted date
            $semesterAttendances = $allAttendances->groupBy(function($item) {
                return is_string($item->date) ? Carbon::parse($item->date)->format('Y-m-d') : $item->date->format('Y-m-d');
            });
        }

        return Inertia::render('Admin/Academic/DailyAttendanceRecaps/Index', [
            'isAdmin' => $isAdmin,
            'isTeacher' => $isTeacher,
            'date' => $date,
            'classId' => $classId,
            'subjectId' => $subjectId,
            'classes' => $classes,
            'subjects' => $subjects,
            'dailyData' => [
                'schedules' => $dailySchedules,
                'students' => $dailyStudents,
                'attendances' => $dailyAttendances,
            ],
            'semesterData' => [
                'students' => $semesterStudents,
                'dates' => $semesterDates,
                'attendances' => $semesterAttendances, // Grouped by date
            ],
        ]);
    }
}
