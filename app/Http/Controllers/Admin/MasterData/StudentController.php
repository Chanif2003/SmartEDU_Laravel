<?php

namespace App\Http\Controllers\Admin\MasterData;

use App\Http\Controllers\Controller;
use App\Services\MasterData\StudentService;
use App\Http\Requests\MasterData\StoreStudentRequest;
use App\Http\Requests\MasterData\UpdateStudentRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    protected $studentService;

    public function __construct(StudentService $studentService)
    {
        $this->studentService = $studentService;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'per_page']);
        $perPage = $request->input('per_page', 10);
        $students = $this->studentService->getPaginated((int) $perPage, $filters);
        $majors = \App\Models\Major::all();
        
        return Inertia::render('Admin/MasterData/UnifiedIndex', [
            'activeTab' => 'students',
            'tabData' => $students,
            'filters' => $filters,
            'majors' => $majors
        ]);
    }

    public function store(StoreStudentRequest $request)
    {
        $this->studentService->create($request->validated());
        return redirect()->back()->with('success', 'Student created successfully.');
    }

    public function update(UpdateStudentRequest $request, $id)
    {
        $this->studentService->update($id, $request->validated());
        return redirect()->back()->with('success', 'Student updated successfully.');
    }

    public function destroy($id)
    {
        $this->studentService->delete($id);
        return redirect()->back()->with('success', 'Student deleted successfully.');
    }
}
