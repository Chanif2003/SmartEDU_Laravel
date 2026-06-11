<?php

namespace App\Http\Controllers\Admin\MasterData;

use App\Http\Controllers\Controller;
use App\Services\MasterData\TimeSlotService;
use App\Http\Requests\MasterData\StoreTimeSlotRequest;
use App\Http\Requests\MasterData\UpdateTimeSlotRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TimeSlotController extends Controller
{
    protected $timeSlotService;

    public function __construct(TimeSlotService $timeSlotService)
    {
        $this->timeSlotService = $timeSlotService;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'per_page']);
        $perPage = $request->query('per_page', 10);
        $timeSlots = $this->timeSlotService->getPaginated($perPage, $filters);
        
        return Inertia::render('Admin/MasterData/UnifiedIndex', [
            'activeTab' => 'timeslots',
            'tabData' => $timeSlots,
            'filters' => $filters
        ]);
    }

    public function store(StoreTimeSlotRequest $request)
    {
        $this->timeSlotService->create($request->validated());
        return redirect()->back()->with('success', 'TimeSlot created successfully.');
    }

    public function update(UpdateTimeSlotRequest $request, $id)
    {
        $this->timeSlotService->update($id, $request->validated());
        return redirect()->back()->with('success', 'TimeSlot updated successfully.');
    }

    public function destroy($id)
    {
        $this->timeSlotService->delete($id);
        return redirect()->back()->with('success', 'TimeSlot deleted successfully.');
    }
}
