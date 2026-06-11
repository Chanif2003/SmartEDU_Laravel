<?php

namespace App\Http\Controllers\Admin\Eskul;

use App\Http\Controllers\Controller;
use App\Services\Eskul\ExtracurricularService;
use App\Http\Requests\Eskul\StoreExtracurricularRequest;
use App\Http\Requests\Eskul\UpdateExtracurricularRequest;
use App\Http\Requests\Eskul\SyncMembersRequest;
use App\Models\Teacher;
use App\Models\Student;
use Inertia\Inertia;

class ExtracurricularController extends Controller
{
    protected $service;

    public function __construct(ExtracurricularService $service)
    {
        $this->service = $service;
    }

    public function index()
    {
        // Eager load coach and its user, plus count students
        $extracurriculars = \App\Models\Extracurricular::with(['coach.user'])
            ->withCount('students')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'coach_id' => $item->coach_id,
                    'coach_name' => ($item->coach && $item->coach->user) ? $item->coach->user->name : '-',
                    'members_count' => $item->students_count,
                ];
            });

        $teachers = Teacher::with('user:id,name')->get()->map(function ($t) {
            return [
                'id' => $t->id,
                'name' => $t->user ? $t->user->name : '-',
            ];
        });

        $students = Student::with('user:id,name')->get()->map(function ($s) {
            return [
                'id' => $s->id,
                'nis' => $s->nis,
                'name' => $s->user ? $s->user->name : '-',
            ];
        });

        $statistics = [
            'member_distribution' => $extracurriculars->map(function ($item) {
                return ['name' => $item['name'], 'value' => $item['members_count']];
            })->values()->toArray()
        ];

        return Inertia::render('Admin/Eskul/Extracurriculars/Index', [
            'extracurriculars' => $extracurriculars,
            'teachers' => $teachers,
            'students' => $students,
            'statistics' => $statistics
        ]);
    }

    public function store(StoreExtracurricularRequest $request)
    {
        $this->service->createExtracurricular($request->validated());
        return redirect()->back()->with('success', 'Ekstrakurikuler berhasil ditambahkan.');
    }

    public function update(UpdateExtracurricularRequest $request, $id)
    {
        $this->service->updateExtracurricular($id, $request->validated());
        return redirect()->back()->with('success', 'Ekstrakurikuler berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $this->service->deleteExtracurricular($id);
        return redirect()->back()->with('success', 'Ekstrakurikuler berhasil dihapus.');
    }

    public function syncMembers(SyncMembersRequest $request, $id)
    {
        $this->service->syncMembers($id, $request->student_ids ?? []);
        return redirect()->back()->with('success', 'Anggota ekstrakurikuler berhasil disinkronisasi.');
    }
}
