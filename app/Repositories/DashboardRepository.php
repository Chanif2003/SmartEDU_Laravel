<?php

namespace App\Repositories;

use App\Models\Applicant;
use App\Models\PresenceRecord;
use App\Models\Schedule;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Models\Teacher;
use App\Repositories\Contracts\DashboardRepositoryInterface;
use Illuminate\Support\Facades\DB;

class DashboardRepository implements DashboardRepositoryInterface
{
    public function getAdminMetrics(): array
    {
        $totalStudents = Student::whereHas('user', function ($query) {
            $query->where('is_active', true);
        })->count();

        $totalTeachers = Teacher::count();
        $totalClasses = SchoolClass::count();
        $pendingApplicants = Applicant::where('status', 'pending')->count();
        $totalSubjects = \App\Models\Subject::count();

        $today = now()->toDateString();
        
        $totalPresenceToday = PresenceRecord::where('date', $today)->count();
        $totalPresentToday = PresenceRecord::where('date', $today)->whereNotNull('status_in')->count();
        
        $attendancePercentage = $totalPresenceToday > 0 
            ? round(($totalPresentToday / $totalPresenceToday) * 100, 2) 
            : 0;

        // --- Mock Data for Charts to match Next.js version ---
        
        // 1. Teacher Gender Data
        $teacherGenderData = [
            ['name' => 'Laki-laki', 'value' => Teacher::where('gender', 'L')->count()],
            ['name' => 'Perempuan', 'value' => Teacher::where('gender', 'P')->count()]
        ];

        // 2. Students per class
        $classes = SchoolClass::with(['students' => function ($query) {
            $query->select('id', 'class_id', 'gender');
        }])->get();

        $studentsPerClassData = $classes->map(function ($c) {
            $lakiLaki = $c->students->where('gender', 'L')->count();
            $perempuan = $c->students->where('gender', 'P')->count();
            
            return [
                'name' => $c->name,
                'laki_laki' => $lakiLaki,
                'perempuan' => $perempuan
            ];
        })->toArray();

        // 3. Weekly & Monthly Attendance Data
        // Optimally, this queries the PresenceRecord table for the last 7 / 30 days
        $weeklyAttendanceData = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $weeklyAttendanceData[] = [
                'date' => now()->subDays($i)->format('d M'),
                'Hadir' => PresenceRecord::where('date', $date)->whereNotNull('status_in')->count(),
                'Belum Hadir' => PresenceRecord::where('date', $date)->whereNull('status_in')->count()
            ];
        }

        $monthlyAttendanceData = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $monthlyAttendanceData[] = [
                'date' => now()->subDays($i)->format('d M'),
                'Hadir' => PresenceRecord::where('date', $date)->whereNotNull('status_in')->count(),
                'Belum Hadir' => PresenceRecord::where('date', $date)->whereNull('status_in')->count()
            ];
        }

        // 4. Today Schedules
        $todaysSchedules = Schedule::with(['teacher', 'schoolClass', 'subject', 'timeSlot'])
            ->where('day', $today)
            ->get()
            ->sortBy(function ($s) {
                return $s->timeSlot->start_time ?? '00:00:00';
            })
            ->map(function($s) {
                return [
                    'id' => $s->id,
                    'subjectName' => $s->subject->name ?? '-',
                    'className' => $s->schoolClass->name ?? '-',
                    'teacherName' => $s->teacher->nama_lengkap ?? '-',
                    'startTime' => $s->timeSlot->start_time ?? '-',
                    'endTime' => $s->timeSlot->end_time ?? '-',
                ];
            })->values()->toArray();

        // 5. Teacher Presence Today
        // Mock absent/present teachers
        $teachers = Teacher::take(5)->get();
        $presentTeachers = $teachers->take(3)->values()->toArray();
        $absentTeachers = $teachers->skip(3)->values()->toArray();

        $majors = \App\Models\Major::with(['students' => function($q) {
            $q->select('id', 'major_id', 'created_at');
        }])->get();

        $majorDistribution = $majors->map(function ($major) {
            return [
                'name' => $major->name,
                'value' => $major->students->count()
            ];
        })->toArray();

        $growthByYear = [];
        foreach ($majors as $major) {
            $groupedByYear = $major->students->groupBy(function($student) {
                return $student->created_at ? $student->created_at->format('Y') : 'Unknown';
            });
            
            foreach ($groupedByYear as $year => $studentsGroup) {
                if (!isset($growthByYear[$year])) {
                    $growthByYear[$year] = ['name' => (string)$year];
                }
                $growthByYear[$year][$major->name] = $studentsGroup->count();
            }
        }
        ksort($growthByYear);
        $majorGrowthDataFormatted = array_values($growthByYear);

        return [
            'active_semester' => 'Genap 2025/2026',
            'total_students' => $totalStudents,
            'total_teachers' => $totalTeachers,
            'total_classes' => $totalClasses,
            'total_subjects' => $totalSubjects,
            'pending_applicants' => $pendingApplicants,
            'attendance_percentage' => $attendancePercentage,
            'teacher_gender_data' => $teacherGenderData,
            'students_per_class_data' => $studentsPerClassData,
            'weekly_attendance_data' => $weeklyAttendanceData,
            'monthly_attendance_data' => $monthlyAttendanceData,
            'todays_schedules' => $todaysSchedules,
            'teacher_presence_today' => [
                'presentTeachers' => $presentTeachers,
                'absentTeachers' => $absentTeachers
            ],
            'major_distribution_data' => $majorDistribution,
            'major_growth_data' => $majorGrowthDataFormatted
        ];
    }

    public function getTeacherMetrics(string $teacherId, string $day): array
    {
        // Untuk guru: Jadwal hari ini, jumlah perwalian kelas (opsional), jurnal pending (dummy 0).
        
        $schedules = Schedule::with(['schoolClass', 'subject', 'timeSlot'])
            ->where('teacher_id', $teacherId)
            ->where('day', $day)
            ->get()
            ->sortBy(function ($s) {
                return $s->timeSlot->start_time ?? '00:00:00';
            })
            ->values()
            ->map(function ($s) {
                $s->start_time = $s->timeSlot->start_time ?? '-';
                $s->end_time = $s->timeSlot->end_time ?? '-';
                return $s;
            });

        $scheduleIds = $schedules->pluck('id')->toArray();
        $todayStr = now()->toDateString();

        $filledJournalSchedules = \App\Models\Journal::whereIn('schedule_id', $scheduleIds)
            ->where('date', $todayStr)
            ->pluck('schedule_id')
            ->toArray();

        $filledAttendanceSchedules = \App\Models\Attendance::whereIn('schedule_id', $scheduleIds)
            ->where('date', $todayStr)
            ->pluck('schedule_id')
            ->toArray();

        $schedules = $schedules->map(function ($s) use ($filledJournalSchedules, $filledAttendanceSchedules) {
            $s->is_journal_filled = in_array($s->id, $filledJournalSchedules);
            $s->is_attendance_filled = in_array($s->id, $filledAttendanceSchedules);
            return $s;
        });

        $pendingJournals = count($scheduleIds) - count($filledJournalSchedules);

        return [
            'today_schedules' => $schedules,
            'pending_journals' => max(0, $pendingJournals),
        ];
    }

    public function getStudentMetrics(string $studentId, string $day): array
    {
        // Untuk siswa: Jadwal berdasarkan class_id, status kehadiran terbaru, violation points, tagihan SPP.
        
        $student = Student::find($studentId);
        
        $schedules = [];
        if ($student && $student->class_id) {
            $schedules = Schedule::with(['teacher', 'subject', 'timeSlot'])
                ->where('class_id', $student->class_id)
                ->where('day', $day)
                ->get()
                ->sortBy(function ($s) {
                    return $s->timeSlot->start_time ?? '00:00:00';
                })
                ->values()
                ->map(function ($s) {
                    $s->start_time = $s->timeSlot->start_time ?? '-';
                    $s->end_time = $s->timeSlot->end_time ?? '-';
                    return $s;
                });
        }

        $latestPresence = PresenceRecord::where('person_id', $studentId)
            ->where('person_type', Student::class)
            ->orderBy('date', 'desc')
            ->first();

        $violationPoints = \App\Models\Violation::where('student_id', $studentId)->sum('points');

        // Check SPP using SppPayment if exists
        $sppStatus = 'paid';
        if (class_exists(\App\Models\SppPayment::class)) {
            $latestSpp = \App\Models\SppPayment::where('student_id', $studentId)->orderBy('created_at', 'desc')->first();
            if ($latestSpp) {
                $sppStatus = strtolower($latestSpp->status);
            }
        }

        return [
            'today_schedules' => $schedules,
            'latest_attendance' => $latestPresence ? $latestPresence->status_in : 'none',
            'violation_points' => $violationPoints,
            'spp_status' => $sppStatus,
        ];
    }
}
