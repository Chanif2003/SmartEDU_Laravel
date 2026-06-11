<?php
namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\StudentReportCard;
use Inertia\Inertia;

class ReportCardController extends Controller
{
    public function index()
    {
        $student = Student::where('user_id', auth()->id())->firstOrFail();
        
        $reportCards = StudentReportCard::with(['semester', 'student.schoolClass'])
            ->where('student_id', $student->id)
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Student/ReportCards/Index', [
            'reportCards' => $reportCards
        ]);
    }
}
