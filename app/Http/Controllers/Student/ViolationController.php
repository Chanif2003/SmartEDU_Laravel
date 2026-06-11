<?php
namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Violation;
use Inertia\Inertia;

class ViolationController extends Controller
{
    public function index()
    {
        $student = Student::where('user_id', auth()->id())->firstOrFail();
        
        $violations = Violation::with(['student'])
            ->where('student_id', $student->id)
            ->orderBy('violation_date', 'desc')
            ->paginate(15);

        $totalPoints = $violations->sum('points');

        return Inertia::render('Student/Violations/Index', [
            'violations' => $violations,
            'totalPoints' => $totalPoints
        ]);
    }
}
