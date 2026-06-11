<?php

namespace App\Http\Controllers\Admin\Assessment;

use App\Http\Controllers\Controller;

use Illuminate\Http\Request;

use App\Repositories\Contracts\Assessment\AssessmentRepositoryInterface;
use App\Repositories\Contracts\SemesterRepositoryInterface;
use App\Repositories\Contracts\SchoolClassRepositoryInterface;
use App\Repositories\Contracts\SubjectRepositoryInterface;
use Inertia\Inertia;

class AssessmentController extends Controller
{
    protected $assessmentRepository;
    protected $semesterRepository;
    protected $classRepository;
    protected $subjectRepository;

    public function __construct(
        AssessmentRepositoryInterface $assessmentRepository,
        SemesterRepositoryInterface $semesterRepository,
        SchoolClassRepositoryInterface $classRepository,
        SubjectRepositoryInterface $subjectRepository
    ) {
        $this->assessmentRepository = $assessmentRepository;
        $this->semesterRepository = $semesterRepository;
        $this->classRepository = $classRepository;
        $this->subjectRepository = $subjectRepository;
    }

    public function index(Request $request)
    {
        $teacherId = auth()->user()->teacherProfile->id ?? null;
        
        $filters = $request->only(['semester_id', 'class_id', 'subject_id']);
        if ($teacherId) {
            $filters['teacher_id'] = $teacherId;
        }

        $learningObjectives = $this->assessmentRepository->getLearningObjectives($filters);
        $assessments = $this->assessmentRepository->getAssessments($filters);
        
        $semesters = $this->semesterRepository->getAll();
        $classes = $this->classRepository->getAll();
        $subjects = $this->subjectRepository->getAll();

        return Inertia::render('Admin/Assessment/Index', [
            'learningObjectives' => $learningObjectives,
            'assessments' => $assessments,
            'semesters' => $semesters,
            'classes' => $classes,
            'subjects' => $subjects,
            'filters' => $filters,
        ]);
    }

    public function storeLearningObjective(Request $request)
    {
        $data = $request->validate([
            'semester_id' => 'required|exists:semesters,id',
            'class_id' => 'required|exists:school_classes,id',
            'subject_id' => 'required|exists:subjects,id',
            'target' => 'required|string',
            'material_scope' => 'required|string',
        ]);
        $data['teacher_id'] = auth()->user()->teacherProfile->id ?? null;

        $this->assessmentRepository->storeLearningObjective($data);
        return back()->with('success', 'Capaian Pembelajaran berhasil disimpan');
    }

    public function storeAssessment(\App\Http\Requests\Admin\Assessment\StoreAssessmentRequest $request)
    {
        $this->assessmentRepository->storeAssessment($request->validated());
        return back()->with('success', 'Penilaian Harian berhasil disimpan');
    }
}
