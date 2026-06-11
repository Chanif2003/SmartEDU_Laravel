<?php

namespace App\Http\Controllers\Admin\PPDB;

use App\Http\Controllers\Controller;
use App\Repositories\Contracts\ApplicantRepositoryInterface;
use App\Services\ApplicantService;
use App\Http\Resources\ApplicantResource;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ApplicantController extends Controller
{
    protected $applicantRepository;
    protected $applicantService;

    public function __construct(
        ApplicantRepositoryInterface $applicantRepository,
        ApplicantService $applicantService
    ) {
        $this->applicantRepository = $applicantRepository;
        $this->applicantService = $applicantService;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'status']);
        $applicants = $this->applicantRepository->paginate(10, $filters);
        
        return Inertia::render('Admin/PPDB/Index', [
            'applicants' => ApplicantResource::collection($applicants),
            'filters' => $filters,
            'statistics' => $this->applicantRepository->getStatistics()
        ]);
    }

    public function show($id)
    {
        $applicant = $this->applicantRepository->find($id);
        
        // Update status to reviewed if it's currently pending and admin views it
        if ($applicant->status === 'pending') {
            $this->applicantRepository->update($id, ['status' => 'reviewed']);
            $applicant->refresh();
        }

        return Inertia::render('Admin/PPDB/Show', [
            'applicant' => new ApplicantResource($applicant)
        ]);
    }

    public function approve($id)
    {
        try {
            $student = $this->applicantService->approveApplicant($id);
            return back()->with('success', 'Pendaftar berhasil disetujui. Siswa ditambahkan.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function reject($id)
    {
        try {
            $this->applicantService->rejectApplicant($id);
            return back()->with('success', 'Pendaftar berhasil ditolak.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
