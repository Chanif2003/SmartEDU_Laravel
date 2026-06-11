<?php

namespace App\Http\Controllers\Admin\Academic;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Assessment;
use App\Models\Journal;
use App\Models\SchoolClass;
use App\Models\Subject;

class DailyAssessmentController extends Controller
{
    public function index(Request $request)
    {
        $teacherId = auth()->user()->role === 'teacher' ? auth()->user()->teacherProfile->id ?? null : null;
        
        $query = Assessment::with(['schoolClass', 'subject', 'teacher.user'])->latest('date');
        
        if ($teacherId) {
            $query->where('teacher_id', $teacherId);
        }

        if ($request->filled('search')) {
            $query->where('topic', 'like', '%' . $request->search . '%');
        }

        $assessments = $query->paginate($request->query('per_page', 10));
        
        $journalQuery = Journal::with(['schoolClass', 'subject', 'teacher.user'])->latest('date');
        if ($teacherId) {
            $journalQuery->where('teacher_id', $teacherId);
        }
        $journals = $journalQuery->get();

        return Inertia::render('Admin/Academic/DailyAssessments/Index', [
            'assessments' => $assessments,
            'journals' => $journals,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'journal_id' => 'required|exists:journals,id',
        ]);

        $journal = Journal::findOrFail($validated['journal_id']);
        
        // Check if assessment already exists for this journal
        $existingAssessment = Assessment::where('date', $journal->date)
            ->where('class_id', $journal->class_id)
            ->where('subject_id', $journal->subject_id)
            ->where('session_number', $journal->session_number)
            ->first();

        if ($existingAssessment) {
            return redirect()->back()->withErrors(['error' => 'Penilaian harian untuk sesi ini sudah dibuat.']);
        }

        $data = [
            'date' => $journal->date,
            'class_id' => $journal->class_id,
            'subject_id' => $journal->subject_id,
            'teacher_id' => $journal->teacher_id,
            'session_number' => $journal->session_number,
            'topic' => $journal->topic,
            'records' => [],
        ];

        Assessment::create($data);

        return redirect()->back()->with('success', 'Penilaian Harian berhasil disimpan.');
    }

    public function show(string $id)
    {
        $assessment = Assessment::with(['schoolClass', 'subject', 'teacher.user'])->findOrFail($id);
        
        $students = \App\Models\Student::where('class_id', $assessment->class_id)
            ->orderBy('nama_lengkap')
            ->get(['id', 'nama_lengkap', 'nisn']);
            
        return Inertia::render('Admin/Academic/DailyAssessments/Show', [
            'assessment' => $assessment,
            'students' => $students,
        ]);
    }

    public function update(Request $request, string $id)
    {
        $assessment = Assessment::findOrFail($id);
        
        $validated = $request->validate([
            'topic' => 'required|string|max:255',
            'records' => 'required|array',
            'records.*.student_id' => 'required|exists:students,id',
            'records.*.score' => 'required|numeric|min:0|max:100',
        ]);

        $assessment->update([
            'topic' => $validated['topic'],
            'records' => $validated['records'],
        ]);

        return redirect()->back()->with('success', 'Data Penilaian Harian berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $assessment = Assessment::findOrFail($id);
        $assessment->delete();
        
        return redirect()->route('admin.academic.daily-assessments.index')->with('success', 'Penilaian Harian berhasil dihapus.');
    }
}
