<?php

namespace App\Http\Controllers\Admin\Assessment;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

use App\Repositories\Contracts\Assessment\ReportCardRepositoryInterface;
use App\Services\Assessment\ReportCardService;
use App\Repositories\Contracts\StudentRepositoryInterface;
use App\Repositories\Contracts\SemesterRepositoryInterface;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportCardController extends Controller
{
    protected $reportCardRepository;
    protected $reportCardService;
    protected $studentRepository;
    protected $semesterRepository;

    public function __construct(
        ReportCardRepositoryInterface $reportCardRepository,
        ReportCardService $reportCardService,
        StudentRepositoryInterface $studentRepository,
        SemesterRepositoryInterface $semesterRepository
    ) {
        $this->reportCardRepository = $reportCardRepository;
        $this->reportCardService = $reportCardService;
        $this->studentRepository = $studentRepository;
        $this->semesterRepository = $semesterRepository;
    }

    public function index(Request $request)
    {
        $students = $this->studentRepository->paginate(10, ['search' => $request->get('search'), 'class_id' => $request->get('class_id')]);
        $semesters = $this->semesterRepository->getAll();

        return Inertia::render('Admin/ReportCard/Index', [
            'students' => $students,
            'semesters' => $semesters,
            'filters' => $request->only(['search', 'class_id']),
        ]);
    }

    public function generate(Request $request, $studentId, $semesterId)
    {
        $this->reportCardService->generateReportCard($studentId, $semesterId);
        return back()->with('success', 'Data Rapor berhasil di-generate.');
    }

    public function show($studentId, $semesterId)
    {
        $reportCard = $this->reportCardRepository->getReportCard($studentId, $semesterId);
        $scores = $this->reportCardRepository->getScoresByStudentAndSemester($studentId, $semesterId);
        $student = $this->studentRepository->find($studentId);
        $semester = $this->semesterRepository->find($semesterId);

        return Inertia::render('Admin/ReportCard/Show', [
            'student' => $student,
            'semester' => $semester,
            'reportCard' => $reportCard,
            'scores' => $scores,
        ]);
    }

    public function printPdf($studentId, $semesterId)
    {
        $reportCard = $this->reportCardRepository->getReportCard($studentId, $semesterId);
        $scores = $this->reportCardRepository->getScoresByStudentAndSemester($studentId, $semesterId);
        $student = $this->studentRepository->find($studentId);
        $semester = $this->semesterRepository->find($semesterId);

        $pdf = Pdf::loadView('pdf.report-card', compact('reportCard', 'scores', 'student', 'semester'));
        $safeSemesterName = str_replace(['/', '\\'], '-', $semester->name);
        return $pdf->download("Rapor_{$student->nama_lengkap}_{$safeSemesterName}.pdf");
    }
}
