<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Semester;
use App\Models\SchoolClass;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\Student;
use App\Models\LearningObjective;
use App\Models\Assessment;
use App\Models\ReportCardScore;
use Illuminate\Support\Str;

class AssessmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $semester = Semester::where('is_active', true)->first();
        if (!$semester) return;

        $classes = SchoolClass::all();
        $teachers = Teacher::take(2)->get();
        $subjects = Subject::take(2)->get();

        if ($classes->isEmpty() || $teachers->isEmpty() || $subjects->isEmpty()) return;

        foreach ($classes as $class) {
            $students = Student::where('class_id', $class->id)->get();
            if ($students->isEmpty()) continue;

            foreach ($subjects as $subject) {
                $teacher = $teachers->random();
                
                // Create 2 Learning Objectives
                $lo1 = LearningObjective::create([
                    'semester_id' => $semester->id,
                    'subject_id' => $subject->id,
                    'teacher_id' => $teacher->id,
                    'class_id' => $class->id,
                    'target' => 'Memahami Konsep Dasar ' . $subject->name,
                    'material_scope' => 'Pengenalan dan teori dasar',
                ]);

                $lo2 = LearningObjective::create([
                    'semester_id' => $semester->id,
                    'subject_id' => $subject->id,
                    'teacher_id' => $teacher->id,
                    'class_id' => $class->id,
                    'target' => 'Penerapan Lanjutan ' . $subject->name,
                    'material_scope' => 'Praktikum dan penyelesaian masalah',
                ]);

                // Create Daily Assessments
                $records = [];
                foreach ($students as $student) {
                    $records[] = [
                        'student_id' => $student->id,
                        'score' => rand(70, 100)
                    ];
                }

                Assessment::create([
                    'date' => now()->subDays(10),
                    'class_id' => $class->id,
                    'subject_id' => $subject->id,
                    'teacher_id' => $teacher->id,
                    'session_number' => 1,
                    'topic' => 'Kuis Tengah Semester',
                    'records' => $records
                ]);

                // Create Report Card Scores
                foreach ($students as $student) {
                    ReportCardScore::create([
                        'semester_id' => $semester->id,
                        'student_id' => $student->id,
                        'subject_id' => $subject->id,
                        'learning_objective_id' => $lo1->id,
                        'report_type' => 'final_term',
                        'pts_score' => rand(70, 95),
                        'pas_score' => rand(75, 98),
                    ]);

                    ReportCardScore::create([
                        'semester_id' => $semester->id,
                        'student_id' => $student->id,
                        'subject_id' => $subject->id,
                        'learning_objective_id' => $lo2->id,
                        'report_type' => 'final_term',
                        'pts_score' => rand(75, 95),
                        'pas_score' => rand(75, 100),
                    ]);
                }
            }
        }
    }
}
