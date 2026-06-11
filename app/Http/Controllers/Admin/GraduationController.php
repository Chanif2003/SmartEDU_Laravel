<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BulkGraduateRequest;
use App\Models\SchoolClass;
use App\Models\Student;
use App\Services\GraduationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Exception;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;

class GraduationController extends Controller
{
    protected $graduationService;

    public function __construct(GraduationService $graduationService)
    {
        $this->graduationService = $graduationService;
    }

    /**
     * Display the graduation management page.
     */
    public function index(Request $request)
    {
        // Get all classes (can be filtered by 12th grade / tingkat akhir if there's an indicator)
        $classes = SchoolClass::orderBy('name')->get();

        $selectedClassId = $request->query('class_id');
        $students = [];

        if ($selectedClassId) {
            $students = Student::with('schoolClass')
                ->where('class_id', $selectedClassId)
                ->where('is_alumni', false) // Only show active students, not alumni
                ->orderBy('nama_lengkap')
                ->get()
                ->map(function ($student) {
                    return [
                        'id' => $student->id,
                        'nisn' => $student->nisn,
                        'nama_lengkap' => $student->nama_lengkap,
                        'class_name' => $student->schoolClass ? $student->schoolClass->name : '-',
                        'is_active' => $student->is_active,
                    ];
                });
        }

        return Inertia::render('Admin/Graduation/Index', [
            'classes' => $classes,
            'students' => $students,
            'selectedClassId' => $selectedClassId,
        ]);
    }

    /**
     * Process bulk graduation.
     */
    public function bulkGraduate(BulkGraduateRequest $request)
    {
        try {
            $validated = $request->validated();
            
            $result = $this->graduationService->bulkGraduate(
                $validated['student_ids'],
                $validated['graduation_date'],
                $validated['graduation_year']
            );

            return redirect()->back()->with('success', $result['message']);
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Gagal memproses kelulusan: ' . $e->getMessage());
        }
    }

    public function alumniList(Request $request)
    {
        $year = $request->query('year');
        $search = $request->query('search');
        $perPage = $request->query('per_page', 10);

        $query = Student::where('is_alumni', true);

        if ($year) {
            $query->where('graduation_year', $year);
        }

        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('nama_lengkap', 'like', "%{$search}%")
                  ->orWhere('nisn', 'like', "%{$search}%")
                  ->orWhere('ijazah_number', 'like', "%{$search}%");
            });
        }

        $alumni = $query->orderBy('graduation_date', 'desc')
                        ->orderBy('nama_lengkap', 'asc')
                        ->paginate($perPage)
                        ->withQueryString();

        return Inertia::render('Admin/Graduation/AlumniList', [
            'alumni' => $alumni,
            'filters' => [
                'year' => $year,
                'search' => $search,
                'per_page' => $perPage,
            ]
        ]);
    }

    public function updateIjazah(Request $request, Student $student)
    {
        $request->validate([
            'skl_number' => ['nullable', 'string', 'max:255', 'unique:students,skl_number,' . $student->id],
            'ijazah_number' => ['nullable', 'string', 'max:255', 'unique:students,ijazah_number,' . $student->id],
            'ijazah_scan' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:2048'],
        ]);

        $data = [
            'skl_number' => $request->skl_number,
            'ijazah_number' => $request->ijazah_number,
        ];

        if ($request->hasFile('ijazah_scan')) {
            if ($student->ijazah_scan) {
                Storage::disk('public')->delete($student->ijazah_scan);
            }
            $data['ijazah_scan'] = $request->file('ijazah_scan')->store('ijazah', 'public');
        }

        $student->update($data);

        return redirect()->back()->with('success', 'Data SKL dan Ijazah berhasil diperbarui.');
    }

    public function printSkl(Student $student)
    {
        if (!$student->is_alumni) {
            abort(404, 'Siswa belum lulus.');
        }

        $pdf = Pdf::loadView('pdf.skl', ['student' => $student]);
        
        return $pdf->stream('SKL_' . str_replace(' ', '_', $student->nama_lengkap) . '.pdf');
    }
}
