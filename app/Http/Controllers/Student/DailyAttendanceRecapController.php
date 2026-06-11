<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Student;
use App\Models\Schedule;
use App\Models\Attendance;
use App\Models\Subject;
use Carbon\Carbon;

class DailyAttendanceRecapController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();
        $student = Student::with('schoolClass')->where('user_id', $user->id)->firstOrFail();
        $classId = $student->class_id;

        $subjectIds = Schedule::where('class_id', $classId)->pluck('subject_id')->unique();
        $subjects = Subject::whereIn('id', $subjectIds)->orderBy('name')->get();

        $subjectId = $request->input('subject_id');
        if (!$subjectId && $subjects->isNotEmpty()) {
            $subjectId = $subjects->first()->id;
        }

        $attendances = collect();

        if ($subjectId) {
            // Get all attendances for this class and subject
            $allClassAttendances = Attendance::with('schedule')
                ->where('class_id', $classId)
                ->where('subject_id', $subjectId)
                ->orderBy('date', 'asc')
                ->get();

            // Filter out only this student's records
            $attendances = $allClassAttendances->map(function ($attendance) use ($student) {
                $status = 'Belum Diisi';
                if ($attendance->records) {
                    $record = collect($attendance->records)->firstWhere('student_id', $student->id);
                    if ($record) {
                        $status = $record['status'] ?? 'Belum Diisi';
                    }
                }
                
                $formattedDate = is_string($attendance->date) ? Carbon::parse($attendance->date)->format('Y-m-d') : $attendance->date->format('Y-m-d');
                
                return [
                    'id' => $attendance->id,
                    'date' => $formattedDate,
                    'status' => $status,
                    'session_number' => $attendance->session_number,
                ];
            });
        }

        return Inertia::render('Student/DailyAttendanceRecaps/Index', [
            'student' => [
                'id' => $student->id,
                'name' => $user->name,
                'nisn' => $student->nisn,
                'class_name' => $student->schoolClass->name ?? '-',
            ],
            'subjects' => $subjects,
            'subjectId' => $subjectId,
            'attendances' => $attendances,
        ]);
    }
}
