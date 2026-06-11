<?php

namespace App\Http\Controllers\Admin\Academic;

use App\Http\Controllers\Controller;
use App\Services\Academic\ScheduleService;
use App\Http\Requests\Academic\StoreScheduleRequest;
use Illuminate\Http\Request;
use App\Models\Semester;
use App\Models\SchoolClass;
use App\Models\Teacher;
use App\Models\Subject;
use App\Models\TimeSlot;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    protected $service;

    public function __construct(ScheduleService $service)
    {
        $this->service = $service;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['class_id', 'teacher_id']);
        $teacherId = auth()->user()->role === 'teacher' ? auth()->user()->teacherProfile->id ?? null : null;
        
        if ($teacherId) {
            $filters['teacher_id'] = $teacherId;
        }
        
        $schedules = collect($this->service->getAllSchedules($filters))->map(function ($item) {
            return [
                'id' => $item->id,
                'semester_id' => $item->semester_id,
                'semester_name' => $item->semester ? $item->semester->name : '-',
                'day' => $item->day,
                'time_slot_id' => $item->time_slot_id,
                'start_time' => $item->timeSlot ? date('H:i', strtotime($item->timeSlot->start_time)) : '',
                'end_time' => $item->timeSlot ? date('H:i', strtotime($item->timeSlot->end_time)) : '',
                'class_id' => $item->class_id,
                'class_name' => $item->schoolClass ? $item->schoolClass->name : '-',
                'teacher_id' => $item->teacher_id,
                'teacher_name' => ($item->teacher && $item->teacher->user) ? $item->teacher->user->name : '-',
                'subject_id' => $item->subject_id,
                'subject_name' => $item->subject ? $item->subject->name : '-',
                'color' => '#3788d8' // default color since color_code doesn't exist
            ];
        });

        // Get Master Data for dropdowns
        $semesters = Semester::select('id', 'name')->where('is_active', true)->get();
        $classes = SchoolClass::select('id', 'name')->get();
        $teachersQuery = Teacher::with('user:id,name');
        if ($teacherId) {
            $teachersQuery->where('id', $teacherId);
        }
        $teachers = $teachersQuery->get()->map(function ($t) {
            return ['id' => $t->id, 'name' => $t->user ? $t->user->name : '-'];
        });
        $subjects = Subject::select('id', 'name')->get();
        $timeSlots = TimeSlot::select('id', 'label as name', 'start_time', 'end_time')->orderBy('start_time')->get();

        return Inertia::render('Admin/Academic/Schedules/Index', [
            'schedules' => $schedules,
            'filters' => $filters,
            'semesters' => $semesters,
            'classes' => $classes,
            'teachers' => $teachers,
            'subjects' => $subjects,
            'timeSlots' => $timeSlots
        ]);
    }

    public function store(StoreScheduleRequest $request)
    {
        $this->service->createSchedule($request->validated());
        return redirect()->back()->with('success', 'Jadwal Akademik berhasil ditambahkan.');
    }

    public function destroy($id)
    {
        $this->service->deleteSchedule($id);
        return redirect()->back()->with('success', 'Jadwal Akademik berhasil dihapus.');
    }
}
