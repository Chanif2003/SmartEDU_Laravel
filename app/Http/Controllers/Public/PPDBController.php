<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreApplicantRequest;
use App\Services\ApplicantService;
use App\Models\Major;
use Inertia\Inertia;
use Illuminate\Http\Request;

class PPDBController extends Controller
{
    protected $applicantService;

    public function __construct(ApplicantService $applicantService)
    {
        $this->applicantService = $applicantService;
    }

    public function index()
    {
        $majors = Major::all();
        return Inertia::render('Public/PPDB/Index', [
            'majors' => $majors
        ]);
    }

    public function store(StoreApplicantRequest $request)
    {
        try {
            $data = $request->validated();
            
            $kkFile = $request->file('document_kk');
            $ijazahFile = $request->file('document_ijazah');
            
            $applicant = $this->applicantService->registerApplicant($data, $kkFile, $ijazahFile);

            return redirect()->route('ppdb.success')->with('applicant', $applicant->toArray());
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal menyimpan data pendaftaran: ' . $e->getMessage()])->withInput();
        }
    }

    public function success(Request $request)
    {
        // Get applicant data from session flash
        $applicant = session('applicant');
        if (!$applicant) {
            return redirect()->route('ppdb.index');
        }

        return Inertia::render('Public/PPDB/Success', [
            'applicant' => $applicant
        ]);
    }
}
