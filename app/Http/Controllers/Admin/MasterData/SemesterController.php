<?php

namespace App\Http\Controllers\Admin\MasterData;

use App\Http\Controllers\Controller;
use App\Services\MasterData\SemesterService;
use App\Http\Requests\MasterData\StoreSemesterRequest;
use App\Http\Requests\MasterData\UpdateSemesterRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SemesterController extends Controller
{
    protected $semesterService;

    public function __construct(SemesterService $semesterService)
    {
        $this->semesterService = $semesterService;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'per_page']);
        $perPage = $request->query('per_page', 10);
        $semesters = $this->semesterService->getPaginated($perPage, $filters);
        
        return Inertia::render('Admin/MasterData/UnifiedIndex', [
            'activeTab' => 'semesters',
            'tabData' => $semesters,
            'filters' => $filters
        ]);
    }

    public function store(StoreSemesterRequest $request)
    {
        $this->semesterService->create($request->validated());
        return redirect()->back()->with('success', 'Semester created successfully.');
    }

    public function update(UpdateSemesterRequest $request, $id)
    {
        $this->semesterService->update($id, $request->validated());
        return redirect()->back()->with('success', 'Semester updated successfully.');
    }

    public function destroy($id)
    {
        $this->semesterService->delete($id);
        return redirect()->back()->with('success', 'Semester deleted successfully.');
    }
}
