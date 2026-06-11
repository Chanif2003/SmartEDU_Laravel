<?php

namespace App\Http\Controllers\Admin\MasterData;

use App\Http\Controllers\Controller;
use App\Services\MasterData\SchoolClassService;
use App\Http\Requests\MasterData\StoreSchoolClassRequest;
use App\Http\Requests\MasterData\UpdateSchoolClassRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SchoolClassController extends Controller
{
    protected $schoolClassService;

    public function __construct(SchoolClassService $schoolClassService)
    {
        $this->schoolClassService = $schoolClassService;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'per_page']);
        $perPage = $request->query('per_page', 10);
        $schoolClasses = $this->schoolClassService->getPaginated($perPage, $filters);
        
        return Inertia::render('Admin/MasterData/UnifiedIndex', [
            'activeTab' => 'classes',
            'tabData' => $schoolClasses,
            'filters' => $filters
        ]);
    }

    public function store(StoreSchoolClassRequest $request)
    {
        $this->schoolClassService->create($request->validated());
        return redirect()->back()->with('success', 'SchoolClass created successfully.');
    }

    public function update(UpdateSchoolClassRequest $request, $id)
    {
        $this->schoolClassService->update($id, $request->validated());
        return redirect()->back()->with('success', 'SchoolClass updated successfully.');
    }

    public function destroy($id)
    {
        $this->schoolClassService->delete($id);
        return redirect()->back()->with('success', 'SchoolClass deleted successfully.');
    }
}
