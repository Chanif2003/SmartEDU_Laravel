<?php

namespace App\Http\Controllers\Admin\Academic;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Academic\JournalRequest;
use App\Services\Admin\Academic\JournalService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Schedule;
use App\Models\SchoolClass;
use App\Models\Subject;

class JournalController extends Controller
{
    protected $journalService;

    public function __construct(JournalService $journalService)
    {
        $this->journalService = $journalService;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'per_page']);
        $teacherId = auth()->user()->role === 'teacher' ? auth()->user()->teacherProfile->id ?? null : null;
        
        if ($teacherId) {
            $filters['teacher_id'] = $teacherId;
        }

        $perPage = $request->query('per_page', 10);
        $journals = $this->journalService->getAll($perPage, $filters);
        
        $scheduleQuery = Schedule::with(['schoolClass', 'subject', 'teacher.user', 'timeSlot']);
        if ($teacherId) {
            $scheduleQuery->where('teacher_id', $teacherId);
        }
        $schedules = $scheduleQuery->get();
        
        $classes = SchoolClass::all();
        $subjects = Subject::all();

        return Inertia::render('Admin/Academic/Journals/Index', [
            'journals' => $journals,
            'schedules' => $schedules,
            'classes' => $classes,
            'subjects' => $subjects,
            'filters' => $filters,
        ]);
    }

    public function store(JournalRequest $request)
    {
        $data = $request->validated();
        if (auth()->user()->role === 'teacher') {
            $data['teacher_id'] = auth()->user()->teacherProfile->id ?? null;
        } else {
            $schedule = Schedule::find($data['schedule_id']);
            if ($schedule) {
                $data['teacher_id'] = $schedule->teacher_id;
            }
        }

        try {
            $this->journalService->create($data);
            return redirect()->back()->with('success', 'Jurnal berhasil disimpan.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Gagal menyimpan jurnal atau duplikasi terdeteksi.']);
        }
    }

    public function show(string $id)
    {
        $journal = $this->journalService->getById($id);
        $journal->load(['schedule', 'schoolClass', 'subject', 'teacher.user']);
        
        $attendance = \App\Models\Attendance::where('schedule_id', $journal->schedule_id)
            ->whereDate('date', $journal->date)
            ->first();
            
        $students = \App\Models\Student::where('class_id', $journal->class_id)
            ->orderBy('nama_lengkap')
            ->get(['id', 'nama_lengkap', 'nisn']);
            
        return Inertia::render('Admin/Academic/Journals/Show', [
            'journal' => $journal,
            'attendance' => $attendance,
            'students' => $students,
        ]);
    }

    public function destroy(string $id)
    {
        $this->journalService->delete($id);
        return redirect()->back()->with('success', 'Jurnal berhasil dihapus.');
    }
}
