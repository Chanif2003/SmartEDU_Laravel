<?php

namespace App\Http\Controllers\Admin\Academic;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Academic\AttendanceRequest;
use App\Models\SchoolClass;
use App\Repositories\Contracts\Academic\AttendanceRepositoryInterface;
use App\Services\Academic\AttendanceService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Student;
use App\Models\Schedule;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    public function __construct(
        protected AttendanceService $attendanceService,
        protected AttendanceRepositoryInterface $attendanceRepo
    ) {}

    public function index(Request $request)
    {
        $date = $request->input('date', now()->toDateString());
        $classId = $request->input('class_id');
        
        $teacherId = auth()->user()->role === 'teacher' ? auth()->user()->teacherProfile->id ?? null : null;

        $classesQuery = SchoolClass::orderBy('grade_level')->orderBy('name');
        if ($teacherId) {
            $classesQuery->whereIn('id', \App\Models\Schedule::where('teacher_id', $teacherId)->pluck('class_id'));
        }
        $classes = $classesQuery->get();
        $attendances = [];
        $students = [];
        $schedules = [];
        $presenceRecords = [];

        $dayName = Carbon::parse($date)->locale('id')->isoFormat('dddd');
        $schedulesQuery = Schedule::with(['subject', 'teacher', 'timeSlot', 'schoolClass'])
            ->where('day', $dayName);
            
        if ($classId) {
            $schedulesQuery->where('class_id', $classId);
        }
        if ($teacherId) {
            $schedulesQuery->where('teacher_id', $teacherId);
        }
        $schedules = $schedulesQuery->get();

        $classIds = $schedules->pluck('class_id')->unique()->toArray();

        $attendances = [];
        $students = [];
        $presenceRecords = [];

        if (!empty($classIds)) {
            $attendancesQuery = \App\Models\Attendance::where('date', $date);
            if ($classId) {
                $attendancesQuery->where('class_id', $classId);
            } else {
                $attendancesQuery->whereIn('class_id', $classIds);
            }
            $attendances = $attendancesQuery->get();

            $studentsQuery = Student::orderBy('nama_lengkap');
            if ($classId) {
                $studentsQuery->where('class_id', $classId);
            } else {
                $studentsQuery->whereIn('class_id', $classIds);
            }
            $students = $studentsQuery->get();
            
            $studentIds = $students->pluck('id')->toArray();
            $presenceRecords = \App\Models\PresenceRecord::where('date', $date)
                ->where('person_type', \App\Models\Student::class)
                ->whereIn('person_id', $studentIds)
                ->get();
        }

        return Inertia::render('Admin/Academic/Attendances/Index', [
            'date' => $date,
            'classId' => $classId,
            'classes' => $classes,
            'attendances' => $attendances,
            'students' => $students,
            'schedules' => $schedules,
            'presenceRecords' => $presenceRecords,
        ]);
    }

    public function store(AttendanceRequest $request)
    {
        $this->attendanceService->processAttendance($request->validated());

        return redirect()->back()->with('success', 'Data absensi berhasil disimpan.');
    }
}
