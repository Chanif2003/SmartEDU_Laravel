<?php

namespace App\Http\Controllers\Admin\Academic;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Academic\SubstitutionRequest;
use App\Services\Admin\Academic\SubstitutionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Schedule;
use App\Models\Teacher;

class SubstitutionController extends Controller
{
    protected $substitutionService;

    public function __construct(SubstitutionService $substitutionService)
    {
        $this->substitutionService = $substitutionService;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['search']);
        $teacherId = auth()->user()->role === 'teacher' ? auth()->user()->teacherProfile->id ?? null : null;
        
        if ($teacherId) {
            $filters['teacher_id'] = $teacherId;
        }

        $substitutions = $this->substitutionService->getAll(10, $filters);
        
        $schedules = Schedule::with(['schoolClass', 'subject', 'teacher.user'])->get();
        
        $teachers = Teacher::with('user')->get();

        return Inertia::render('Admin/Academic/Substitutions/Index', [
            'substitutions' => $substitutions,
            'schedules' => $schedules,
            'teachers' => $teachers,
            'filters' => $filters,
            'currentTeacherId' => $teacherId,
        ]);
    }

    public function store(SubstitutionRequest $request)
    {
        $data = $request->validated();
        
        $schedule = Schedule::find($data['schedule_id']);
        $data['original_teacher_id'] = $schedule->teacher_id;

        $this->substitutionService->create($data);
        return redirect()->back()->with('success', 'Guru pengganti berhasil ditugaskan.');
    }

    public function destroy(string $id)
    {
        $this->substitutionService->delete($id);
        return redirect()->back()->with('success', 'Data substitusi berhasil dihapus.');
    }
}
