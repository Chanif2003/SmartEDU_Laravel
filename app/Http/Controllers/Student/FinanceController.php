<?php
namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\SppPayment;
use Inertia\Inertia;

class FinanceController extends Controller
{
    public function index()
    {
        $student = Student::where('user_id', auth()->id())->firstOrFail();
        
        $payments = [];
        if (class_exists(\App\Models\SppPayment::class)) {
            $payments = SppPayment::where('student_id', $student->id)
                ->orderBy('payment_date', 'desc')
                ->paginate(15);
        }

        return Inertia::render('Student/Finance/Index', [
            'payments' => $payments
        ]);
    }
}
