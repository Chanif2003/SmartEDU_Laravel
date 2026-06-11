<?php

namespace App\Http\Controllers\Admin\Discipline;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Discipline\ViolationRequest;
use App\Models\Student;
use App\Services\Admin\Discipline\ViolationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ViolationController extends Controller
{
    protected $violationService;

    public function __construct(ViolationService $violationService)
    {
        $this->violationService = $violationService;
    }

    public function index(Request $request)
    {
        $user = auth()->user();
        $filters = $request->only(['search']);

        if ($user->role === 'student') {
            $student = $user->student;
            $violations = $this->violationService->getStudentViolations($student->id, 10);
            $totalPoints = $this->violationService->getStudentTotalPoints($student->id);

            return Inertia::render('Admin/Discipline/Violations/Index', [
                'violations' => $violations,
                'totalPoints' => $totalPoints,
                'filters' => $filters,
            ]);
        }

        // For Admin / Teacher
        $violations = $this->violationService->getAllViolations(10, $filters);
        $students = Student::with('user')->get()->map(function ($s) {
            return [
                'id' => $s->id,
                'name' => $s->user->name,
                'nisn' => $s->nisn,
            ];
        });

        // Computed statistics
        $categoryCounts = \App\Models\Violation::selectRaw('category, count(*) as count')->groupBy('category')->pluck('count', 'category')->toArray();
        $typeCounts = \App\Models\Violation::selectRaw('violation_type, count(*) as count')->groupBy('violation_type')->orderByDesc('count')->limit(5)->pluck('count', 'violation_type')->toArray();

        $statistics = [
            'category_distribution' => array_map(function ($k, $v) { return ['name' => ucfirst($k), 'value' => $v]; }, array_keys($categoryCounts), array_values($categoryCounts)),
            'type_distribution' => array_map(function ($k, $v) { return ['name' => ucfirst($k), 'value' => $v]; }, array_keys($typeCounts), array_values($typeCounts))
        ];

        return Inertia::render('Admin/Discipline/Violations/Index', [
            'violations' => $violations,
            'students' => $students,
            'filters' => $filters,
            'statistics' => $statistics,
        ]);
    }

    public function store(ViolationRequest $request)
    {
        // Only Admin and Teacher can store (handled by UI and we will add abort here just in case)
        if (auth()->user()->role === 'student') {
            abort(403, 'Unauthorized action.');
        }

        $data = $request->validated();

        // If teacher creates, assign teacher_id. If admin, leave null or assign if they are also a teacher.
        if (auth()->user()->role === 'teacher') {
            $data['teacher_id'] = auth()->user()->teacherProfile->id ?? null;
        }

        $this->violationService->createViolation($data);

        return redirect()->back()->with('success', 'Data pelanggaran berhasil ditambahkan.');
    }

    public function update(ViolationRequest $request, string $id)
    {
        if (auth()->user()->role === 'student') {
            abort(403, 'Unauthorized action.');
        }

        $data = $request->validated();
        $this->violationService->updateViolation($id, $data);

        return redirect()->back()->with('success', 'Data pelanggaran berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        $this->violationService->deleteViolation($id);

        return redirect()->back()->with('success', 'Data pelanggaran berhasil dihapus.');
    }
}
