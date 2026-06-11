<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Student;
use App\Models\Attendance;
use App\Models\Teacher;
use App\Models\SchoolClass;
use Illuminate\Support\Str;

class BukuIndukAdditionalDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $students = Student::all();
        if ($students->isEmpty()) {
            return;
        }

        $teacher = Teacher::first();
        $class = SchoolClass::first();

        if (!$teacher || !$class) {
            return;
        }

        \DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Generate Attendance Data
        // Create 20 days of attendance
        for ($i = 1; $i <= 20; $i++) {
            $date = now()->subDays($i)->format('Y-m-d');
            
            $records = [];
            foreach ($students as $student) {
                // Randomly assign status
                $rand = rand(1, 100);
                $status = 'Hadir';
                if ($rand > 80 && $rand <= 90) $status = 'Sakit';
                elseif ($rand > 90 && $rand <= 95) $status = 'Izin';
                elseif ($rand > 95) $status = 'Alfa';

                $records[] = [
                    'student_id' => $student->id,
                    'status' => $status,
                ];
            }

            // Using Eloquent handles UUID generation for id
            $attendance = new Attendance([
                'date' => $date,
                'class_id' => $class->id,
                'teacher_id' => $teacher->id,
                'schedule_id' => Str::uuid()->toString(),
                'subject_id' => Str::uuid()->toString(),
                'records' => $records,
            ]);
            $attendance->save();
        }

        // Generate Violations Data
        // Delete existing violations
        \DB::table('violations')->truncate();

        foreach ($students as $student) {
            // Some students get violations
            if (rand(1, 100) > 70) {
                $numViolations = rand(1, 3);
                for ($v = 0; $v < $numViolations; $v++) {
                    $types = ['ringan', 'sedang', 'berat'];
                    $type = $types[array_rand($types)];
                    
                    $points = 10;
                    if ($type === 'sedang') $points = 25;
                    if ($type === 'berat') $points = 50;

                    \DB::table('violations')->insert([
                        'id' => Str::uuid()->toString(),
                        'date' => now()->subDays(rand(1, 60))->format('Y-m-d'),
                        'student_id' => $student->id,
                        'teacher_id' => $teacher->id,
                        'violation_type' => $type,
                        'category' => 'Ketertiban',
                        'description' => 'Pelanggaran ' . $type . ' oleh siswa',
                        'action_taken' => 'Teguran lisan',
                        'points' => $points,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }
}
