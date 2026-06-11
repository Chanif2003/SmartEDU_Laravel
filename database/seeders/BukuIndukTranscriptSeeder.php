<?php

namespace Database\Seeders;

use App\Models\Student;
use App\Models\Semester;
use App\Models\Subject;
use App\Models\LearningObjective;
use App\Models\ReportCardScore;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BukuIndukTranscriptSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create 6 semesters
        $semesters = [];
        $semesterNames = [
            'Ganjil 2023/2024',
            'Genap 2023/2024',
            'Ganjil 2024/2025',
            'Genap 2024/2025',
            'Ganjil 2025/2026',
            'Genap 2025/2026'
        ];
        
        foreach ($semesterNames as $name) {
            $semesters[] = Semester::firstOrCreate(['name' => $name], ['is_active' => false]);
        }
        
        // 2. We use existing subjects or learning objectives if possible
        $teacher = \App\Models\Teacher::first();
        $class = \App\Models\SchoolClass::first();
        
        $subjects = \App\Models\Subject::take(6)->get();
        if ($subjects->isEmpty()) {
            $subjects = [
                Subject::firstOrCreate(['name' => 'Pendidikan Agama', 'code' => 'PA']),
                Subject::firstOrCreate(['name' => 'Bahasa Indonesia', 'code' => 'BI']),
                Subject::firstOrCreate(['name' => 'Matematika', 'code' => 'MTK'])
            ];
        }

        $learningObjectives = [];
        foreach ($subjects as $subject) {
            $learningObjectives[] = LearningObjective::firstOrCreate([
                'subject_id' => $subject->id,
                'semester_id' => $semesters[0]->id,
                'teacher_id' => $teacher->id ?? null,
                'class_id' => $class->id ?? null,
                'target' => 'Materi ' . $subject->name,
                'material_scope' => 'Lingkup ' . $subject->name,
            ]);
        }

        $students = Student::all();
        foreach ($students as $student) {
            // Delete old scores
            $student->reportCardScores()->delete();

            // Create 6 semester scores
            foreach ($semesters as $index => $semester) {
                foreach ($learningObjectives as $lo) {
                    $scoreVal = rand(75, 95);
                    ReportCardScore::create([
                        'student_id' => $student->id,
                        'semester_id' => $semester->id,
                        'subject_id' => $lo->subject_id,
                        'learning_objective_id' => $lo->id,
                        'report_type' => 'final_term',
                        'pts_score' => $scoreVal - rand(1, 5),
                        'pas_score' => $scoreVal,
                    ]);
                }
            }
        }
    }
}
