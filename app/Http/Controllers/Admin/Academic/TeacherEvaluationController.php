<?php

namespace App\Http\Controllers\Admin\Academic;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Academic\TeacherEvaluationRequest;
use App\Services\Admin\Academic\TeacherEvaluationService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherEvaluationController extends Controller
{
    protected $evaluationService;

    public function __construct(TeacherEvaluationService $evaluationService)
    {
        $this->evaluationService = $evaluationService;
    }

    public function store(TeacherEvaluationRequest $request)
    {
        $data = $request->validated();
        $data['evaluator_id'] = auth()->id();
        $this->evaluationService->create($data);
        return redirect()->back()->with('success', 'Evaluasi guru berhasil ditambahkan.');
    }

    public function destroy(string $id)
    {
        $this->evaluationService->delete($id);
        return redirect()->back()->with('success', 'Evaluasi berhasil dihapus.');
    }

    public function autoGenerate(Request $request)
    {
        $validated = $request->validate([
            'teacher_id' => 'required|exists:teachers,id',
            'month' => 'required|date_format:Y-m',
        ]);

        $this->evaluationService->generateKPI(
            $validated['teacher_id'], 
            $validated['month'], 
            auth()->id()
        );

        return redirect()->back()->with('success', 'KPI Evaluasi otomatis berhasil dihitung.');
    }
}
