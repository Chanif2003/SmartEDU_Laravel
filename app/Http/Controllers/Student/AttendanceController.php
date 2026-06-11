<?php
namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\PresenceRecord;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    public function index()
    {
        $student = Student::where('user_id', auth()->id())->firstOrFail();
        
        $attendances = PresenceRecord::where('person_id', $student->id)
            ->where('person_type', Student::class)
            ->orderBy('date', 'desc')
            ->paginate(15);

        return Inertia::render('Student/Attendances/Index', [
            'attendances' => $attendances
        ]);
    }
}
