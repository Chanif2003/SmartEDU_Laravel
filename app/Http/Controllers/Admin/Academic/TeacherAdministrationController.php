<?php

namespace App\Http\Controllers\Admin\Academic;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Academic\TeacherAdministrationRequest;
use App\Services\Admin\Academic\TeacherAdministrationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Semester;
use App\Models\Subject;
use App\Models\Teacher;

class TeacherAdministrationController extends Controller
{
    protected $administrationService;

    public function __construct(TeacherAdministrationService $administrationService)
    {
        $this->administrationService = $administrationService;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['search']);
        $teacherId = auth()->user()->role === 'teacher' ? auth()->user()->teacherProfile->id ?? null : null;
        
        if ($teacherId) {
            $filters['teacher_id'] = $teacherId;
        }

        $administrations = $this->administrationService->getAll(10, $filters);
        
        $semesters = Semester::all();
        $subjects = Subject::all();
        
        $teachersQuery = Teacher::with('user');
        if ($teacherId) {
            $teachersQuery->where('id', $teacherId);
        }
        $teachers = $teachersQuery->get();

        return Inertia::render('Admin/Academic/Administrations/Index', [
            'administrations' => $administrations,
            'semesters' => $semesters,
            'subjects' => $subjects,
            'teachers' => $teachers,
            'filters' => $filters,
        ]);
    }

    public function store(TeacherAdministrationRequest $request)
    {
        $data = $request->validated();
        
        if (auth()->user()->role === 'teacher') {
            $data['teacher_id'] = auth()->user()->teacherProfile->id ?? null;
        } else {
            // Admin must provide teacher_id but for simplicity let's handle via request or assume it's for currently authed teacher
            if (!isset($data['teacher_id']) && $request->has('teacher_id')) {
                $data['teacher_id'] = $request->teacher_id;
            }
        }

        // Handle file uploads
        $files = [
            'prota_file' => 'prota_path', 
            'promes_file' => 'promes_path', 
            'cp_file' => 'cp_path', 
            'atp_file' => 'atp_path', 
            'modul_file' => 'modul_path',
            'kktp_file' => 'kktp_path',
            'lkpd_file' => 'lkpd_path',
            'rubrik_file' => 'rubrik_path'
        ];
        foreach ($files as $fileKey => $pathKey) {
            if ($request->hasFile($fileKey)) {
                $path = $request->file($fileKey)->store('administrations', 'public');
                $data[$pathKey] = $path;
            }
        }

        try {
            $this->administrationService->create($data);
            return redirect()->back()->with('success', 'Administrasi berhasil diunggah.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Gagal menyimpan administrasi. Pastikan data tidak duplikat.']);
        }
    }

    public function destroy(string $id)
    {
        $this->administrationService->delete($id);
        return redirect()->back()->with('success', 'Administrasi berhasil dihapus.');
    }
}
