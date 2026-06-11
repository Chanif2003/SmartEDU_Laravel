<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTracerStudyRequest;
use App\Http\Requests\VerifyTracerRequest;
use App\Services\TracerStudyService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TracerStudyController extends Controller
{
    protected $tracerStudyService;

    public function __construct(TracerStudyService $tracerStudyService)
    {
        $this->tracerStudyService = $tracerStudyService;
    }

    public function index()
    {
        return Inertia::render('Public/TracerStudy/Index');
    }

    public function verify(VerifyTracerRequest $request)
    {
        try {
            $student = $this->tracerStudyService->verifyStudent(
                $request->identity_number, 
                $request->birth_date
            );

            // Fetch existing data for current year if any
            $currentYear = date('Y');
            $existingTracer = $student->tracerStudies()->where('entry_year', $currentYear)->first();

            return back()->with('verified_student', [
                'id' => $student->id,
                'full_name' => $student->nama_lengkap,
                'graduation_year' => $student->graduation_year,
                'existing_data' => $existingTracer
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['verification' => $e->getMessage()]);
        }
    }

    public function store(StoreTracerStudyRequest $request)
    {
        try {
            $this->tracerStudyService->submitTracerStudy($request->validated());
            return back()->with('success', 'Data Tracer Study berhasil disimpan. Terima kasih atas partisipasi Anda!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal menyimpan data: ' . $e->getMessage()]);
        }
    }
}
