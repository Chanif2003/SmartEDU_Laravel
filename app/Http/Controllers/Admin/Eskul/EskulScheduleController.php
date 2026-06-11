<?php

namespace App\Http\Controllers\Admin\Eskul;

use App\Http\Controllers\Controller;
use App\Services\Eskul\EskulScheduleService;
use App\Http\Requests\Eskul\StoreEskulScheduleRequest;
use App\Http\Requests\Eskul\UpdateEskulScheduleRequest;
use App\Models\Extracurricular;
use App\Models\Semester;
use Inertia\Inertia;

class EskulScheduleController extends Controller
{
    protected $service;

    public function __construct(EskulScheduleService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        $schedules = collect($this->service->getAllSchedules())->map(function ($item) {
            return [
                'id' => $item->id,
                'semester_id' => $item->semester_id,
                'semester_name' => $item->semester ? $item->semester->name : '-',
                'extracurricular_id' => $item->extracurricular_id,
                'extracurricular_name' => $item->extracurricular ? $item->extracurricular->name : '-',
                'day' => $item->day,
                'start_time' => $item->start_time ? date('H:i', strtotime($item->start_time)) : null,
                'end_time' => $item->end_time ? date('H:i', strtotime($item->end_time)) : null,
                'location' => $item->location,
            ];
        });

        $semesters = Semester::select('id', 'name')->where('is_active', true)->get();
        $extracurriculars = Extracurricular::select('id', 'name')->get();

        return Inertia::render('Admin/Eskul/Schedules/Index', [
            'schedules' => $schedules,
            'semesters' => $semesters,
            'extracurriculars' => $extracurriculars
        ]);
    }

    public function store(StoreEskulScheduleRequest $request)
    {
        $this->service->createSchedule($request->validated());
        return redirect()->back()->with('success', 'Jadwal Ekstrakurikuler berhasil ditambahkan.');
    }

    public function update(UpdateEskulScheduleRequest $request, $id)
    {
        $this->service->updateSchedule($id, $request->validated());
        return redirect()->back()->with('success', 'Jadwal Ekstrakurikuler berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $this->service->deleteSchedule($id);
        return redirect()->back()->with('success', 'Jadwal Ekstrakurikuler berhasil dihapus.');
    }
}
