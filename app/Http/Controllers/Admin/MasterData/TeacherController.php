<?php

namespace App\Http\Controllers\Admin\MasterData;

use App\Http\Controllers\Controller;
use App\Services\MasterData\TeacherService;
use App\Http\Requests\MasterData\StoreTeacherRequest;
use App\Http\Requests\MasterData\UpdateTeacherRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherController extends Controller
{
    protected $teacherService;

    public function __construct(TeacherService $teacherService)
    {
        $this->teacherService = $teacherService;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'per_page']);
        $perPage = $request->query('per_page', 10);
        $teachers = $this->teacherService->getPaginated($perPage, $filters);
        
        return Inertia::render('Admin/MasterData/UnifiedIndex', [
            'activeTab' => 'teachers',
            'tabData' => $teachers,
            'filters' => $filters
        ]);
    }

    public function show($id)
    {
        // Auto-generate KPI for current and last 2 months dynamically
        try {
            $evaluatorId = auth()->id() ?? auth()->user()->id;
            $service = app(\App\Services\Admin\Academic\TeacherEvaluationService::class);
            $monthsToGenerate = [
                \Carbon\Carbon::now()->subMonths(2)->format('Y-m'),
                \Carbon\Carbon::now()->subMonths(1)->format('Y-m'),
                \Carbon\Carbon::now()->format('Y-m'),
            ];
            foreach ($monthsToGenerate as $m) {
                $service->generateKPI($id, $m, $evaluatorId);
            }
        } catch (\Exception $e) {
            // Ignore if fails
        }

        $teacher = $this->teacherService->find($id);
        $teacher->load([
            'evaluations.evaluator',
            'schedules.schoolClass',
            'schedules.subject',
            'schedules.timeSlot',
            'schedules.semester'
        ]);

        return Inertia::render('Admin/MasterData/Teachers/Show', [
            'teacher' => $teacher
        ]);
    }

    public function store(StoreTeacherRequest $request)
    {
        $this->teacherService->create($request->validated());
        return redirect()->back()->with('success', 'Teacher created successfully.');
    }

    public function update(UpdateTeacherRequest $request, $id)
    {
        $this->teacherService->update($id, $request->validated());
        return redirect()->back()->with('success', 'Teacher updated successfully.');
    }

    public function destroy($id)
    {
        $this->teacherService->delete($id);
        return redirect()->back()->with('success', 'Teacher deleted successfully.');
    }
}
