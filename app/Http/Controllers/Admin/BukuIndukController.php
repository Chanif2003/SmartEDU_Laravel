<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\BukuIndukService;
use App\Models\SchoolClass;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BukuIndukController extends Controller
{
    public function __construct(
        protected BukuIndukService $bukuIndukService
    ) {}

    /**
     * Display a listing of the Buku Induk.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'status', 'class_id']);
        $students = $this->bukuIndukService->getPaginatedList($filters, 15);
        $classes = SchoolClass::orderBy('grade_level')->orderBy('name')->get();

        return Inertia::render('Admin/BukuInduk/Index', [
            'students' => $students,
            'classes' => $classes,
            'filters' => $filters,
        ]);
    }

    /**
     * Display the specified Buku Induk detail.
     */
    public function show(string $id)
    {
        $student = $this->bukuIndukService->getStudentBukuInduk($id);

        return Inertia::render('Admin/BukuInduk/Show', [
            'student' => $student
        ]);
    }

    /**
     * Update buku induk metadata.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'registration_type' => 'nullable|in:baru,pindahan',
            'origin_school' => 'nullable|string|max:255',
            'entry_date' => 'nullable|date',
            'entry_semester_id' => 'nullable|exists:semesters,id',
            'exit_date' => 'nullable|date',
            'exit_reason' => 'nullable|string|max:255',
            'notes_buku_induk' => 'nullable|string',
        ]);

        try {
            $this->bukuIndukService->updateBukuIndukInfo($id, $validated);
            return back()->with('success', 'Data Buku Induk berhasil diperbarui.');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal memperbarui data: ' . $e->getMessage());
        }
    }
}
