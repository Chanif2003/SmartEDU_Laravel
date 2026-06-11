<?php

namespace App\Http\Controllers\Admin\MasterData;

use App\Http\Controllers\Controller;
use App\Services\MasterData\SubjectService;
use App\Http\Requests\MasterData\StoreSubjectRequest;
use App\Http\Requests\MasterData\UpdateSubjectRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubjectController extends Controller
{
    protected $subjectService;

    public function __construct(SubjectService $subjectService)
    {
        $this->subjectService = $subjectService;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'per_page']);
        $perPage = $request->query('per_page', 10);
        $subjects = $this->subjectService->getPaginated($perPage, $filters);
        
        return Inertia::render('Admin/MasterData/UnifiedIndex', [
            'activeTab' => 'subjects',
            'tabData' => $subjects,
            'filters' => $filters
        ]);
    }

    public function store(StoreSubjectRequest $request)
    {
        $this->subjectService->create($request->validated());
        return redirect()->back()->with('success', 'Subject created successfully.');
    }

    public function update(UpdateSubjectRequest $request, $id)
    {
        $this->subjectService->update($id, $request->validated());
        return redirect()->back()->with('success', 'Subject updated successfully.');
    }

    public function destroy($id)
    {
        $this->subjectService->delete($id);
        return redirect()->back()->with('success', 'Subject deleted successfully.');
    }
}
