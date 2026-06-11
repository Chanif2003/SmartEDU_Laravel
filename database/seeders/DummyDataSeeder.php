<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Teacher;
use App\Models\Student;
use App\Models\Subject;
use App\Models\SchoolClass;
use App\Models\Semester;
use App\Models\TimeSlot;
use App\Models\Extracurricular;
use App\Models\Schedule;
use Faker\Factory as Faker;
use Illuminate\Support\Str;

class DummyDataSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create('id_ID');

        // 1. Create Semester
        $semester = Semester::firstOrCreate(
            ['name' => '2026/2027 Ganjil'],
            ['is_active' => true]
        );

        // 2. Create Subjects
        $subjectsData = [
            ['name' => 'Matematika', 'color_code' => '#ffadad'],
            ['name' => 'Bahasa Indonesia', 'color_code' => '#ffd6a5'],
            ['name' => 'Bahasa Inggris', 'color_code' => '#fdffb6'],
            ['name' => 'Pendidikan Agama', 'color_code' => '#caffbf'],
            ['name' => 'Pemrograman Web (RPL)', 'color_code' => '#9bf6ff'],
            ['name' => 'Basis Data (RPL)', 'color_code' => '#a0c4ff'],
            ['name' => 'Adm. Infrastruktur (TKJ)', 'color_code' => '#bdb2ff'],
            ['name' => 'Teknologi Jaringan (TKJ)', 'color_code' => '#ffc6ff'],
            ['name' => 'Akuntansi Keuangan (AKL)', 'color_code' => '#fffffc'],
            ['name' => 'Komputer Akuntansi (AKL)', 'color_code' => '#e5e5e5'],
        ];

        $subjectIds = [];
        foreach ($subjectsData as $s) {
            $subj = Subject::firstOrCreate(['name' => $s['name']]);
            $subjectIds[$s['name']] = $subj->id;
        }

        // 3. Create Teachers (1 per subject)
        $teacherIds = [];
        foreach ($subjectsData as $idx => $s) {
            $name = $faker->name;
            $user = User::create([
                'name' => $name,
                'email' => "guru{$idx}@smk.com",
                'username' => "guru{$idx}",
                'password' => bcrypt('password'),
                'role' => 'teacher',
                'is_active' => true,
            ]);
            $teacher = Teacher::create([
                'user_id' => $user->id,
                'nip' => '1980000000000' . sprintf('%03d', $idx),
                'nama_lengkap' => $name,
            ]);
            $teacherIds[$s['name']] = $teacher->id;
        }

        // 4. Create Majors
        $majorData = [
            'RPL' => ['name' => 'Rekayasa Perangkat Lunak', 'description' => 'Jurusan Pemrograman dan Software'],
            'TKJ' => ['name' => 'Teknik Komputer dan Jaringan', 'description' => 'Jurusan Jaringan Komputer'],
            'AKL' => ['name' => 'Akuntansi dan Keuangan Lembaga', 'description' => 'Jurusan Keuangan dan Akuntansi'],
        ];

        $majorIds = [];
        foreach ($majorData as $code => $data) {
            $major = \App\Models\Major::firstOrCreate(
                ['name' => $data['name']],
                ['description' => $data['description']]
            );
            $majorIds[$code] = $major->id;
        }

        // 4.1 Create Classes (3 Grades x 3 Majors = 9 Classes)
        $classNames = [
            '10-RPL', '10-TKJ', '10-AKL',
            '11-RPL', '11-TKJ', '11-AKL',
            '12-RPL', '12-TKJ', '12-AKL'
        ];

        $classIds = [];
        foreach ($classNames as $name) {
            $grade = explode('-', $name)[0];
            $cls = SchoolClass::firstOrCreate(
                ['name' => $name],
                ['grade_level' => $grade]
            );
            $classIds[$name] = $cls->id;
        }

        // 5. Create Students (20 per class)
        $studentIds = [];
        $nisCounter = 1000;
        foreach ($classIds as $className => $classId) {
            $majorCode = explode('-', $className)[1];
            $majorId = $majorIds[$majorCode] ?? null;

            for ($i = 0; $i < 20; $i++) {
                $nisCounter++;
                $studentName = $faker->name;
                $user = User::create([
                    'name' => $studentName,
                    'email' => "siswa{$nisCounter}@smk.com",
                    'username' => (string)$nisCounter,
                    'password' => bcrypt('password'),
                    'role' => 'student',
                    'is_active' => true,
                ]);
                $student = Student::create([
                    'user_id' => $user->id,
                    'class_id' => $classId,
                    'major_id' => $majorId,
                    'nisn' => (string)$nisCounter,
                    'nama_lengkap' => $studentName,
                ]);
                $studentIds[] = $student->id;
            }
        }

        // 6. Extracurriculars
        $eskuls = ['Pramuka', 'PMR', 'Paskibra', 'Futsal', 'Basket'];
        $eskulModels = [];
        foreach ($eskuls as $e) {
            $eskulModels[] = Extracurricular::create([
                'name' => $e,
                'coach_id' => $teacherIds[array_rand($teacherIds)]
            ]);
        }

        // Assign 1 eskul to each student
        foreach ($studentIds as $sId) {
            $randomEskul = $eskulModels[array_rand($eskulModels)];
            $randomEskul->students()->attach($sId);
        }

        // 7. Time Slots (8 JP)
        $timeSlots = [];
        $startTime = strtotime('07:00:00');
        for ($i = 1; $i <= 8; $i++) {
            $endTime = $startTime + (30 * 60);
            $ts = TimeSlot::create([
                'label' => "Jam Ke-$i",
                'start_time' => date('H:i:s', $startTime),
                'end_time' => date('H:i:s', $endTime),
            ]);
            $timeSlots[] = $ts->id;
            $startTime = $endTime;
        }

        // 8. Schedules
        // Simple schedule logic to avoid conflicts: 
        // We iterate each Class and Day. Then we assign TimeSlots.
        $days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
        
        // Track teacher availability: $teacherBusy[day][timeslot][teacher_id] = true
        $teacherBusy = [];

        foreach ($classNames as $className) {
            $cId = $classIds[$className];
            
            // Determine major specific subjects
            $majorSubjects = ['Matematika', 'Bahasa Indonesia', 'Bahasa Inggris', 'Pendidikan Agama'];
            if (str_contains($className, 'RPL')) {
                $majorSubjects = array_merge($majorSubjects, ['Pemrograman Web (RPL)', 'Basis Data (RPL)']);
            } elseif (str_contains($className, 'TKJ')) {
                $majorSubjects = array_merge($majorSubjects, ['Adm. Infrastruktur (TKJ)', 'Teknologi Jaringan (TKJ)']);
            } elseif (str_contains($className, 'AKL')) {
                $majorSubjects = array_merge($majorSubjects, ['Akuntansi Keuangan (AKL)', 'Komputer Akuntansi (AKL)']);
            }

            foreach ($days as $day) {
                // Pick 3-4 random time slots per day for this class
                $numSlots = rand(3, 5);
                $pickedSlots = (array) array_rand(array_flip($timeSlots), $numSlots);

                foreach ($pickedSlots as $tsId) {
                    // Find a random subject/teacher that is free
                    shuffle($majorSubjects);
                    foreach ($majorSubjects as $subjName) {
                        $sId = $subjectIds[$subjName];
                        $tId = $teacherIds[$subjName];

                        // Check if teacher busy
                        if (!isset($teacherBusy[$day][$tsId][$tId])) {
                            // Assign schedule
                            Schedule::create([
                                'semester_id' => $semester->id,
                                'day' => $day,
                                'time_slot_id' => $tsId,
                                'class_id' => $cId,
                                'teacher_id' => $tId,
                                'subject_id' => $sId,
                            ]);
                            $teacherBusy[$day][$tsId][$tId] = true;
                            break; // Done for this timeslot
                        }
                    }
                }
            }
        }

        // 9. KBM - Journals
        $schedules = Schedule::all();
        if ($schedules->count() > 0) {
            foreach ($schedules->take(20) as $idx => $sch) {
                \App\Models\Journal::create([
                    'date' => date('Y-m-d', strtotime('-' . rand(0, 10) . ' days')),
                    'schedule_id' => $sch->id,
                    'class_id' => $sch->class_id,
                    'subject_id' => $sch->subject_id,
                    'teacher_id' => $sch->teacher_id,
                    'session_number' => rand(1, 5),
                    'topic' => 'Topik ' . $sch->subject->name . ' Bagian ' . ($idx + 1),
                    'time_context' => '07:00 - 08:30',
                    'notes' => 'Catatan jurnal ke-' . ($idx + 1),
                ]);
            }

            // 10. KBM - Substitutions
            foreach ($schedules->skip(20)->take(5) as $idx => $sch) {
                $substitutes = array_diff(array_values($teacherIds), [$sch->teacher_id]);
                if (empty($substitutes)) continue;
                $subId = $substitutes[array_rand($substitutes)];

                \App\Models\Substitution::create([
                    'date' => date('Y-m-d', strtotime('+' . rand(1, 5) . ' days')),
                    'schedule_id' => $sch->id,
                    'original_teacher_id' => $sch->teacher_id,
                    'substitute_teacher_id' => $subId,
                    'absence_reason' => 'Dinas Luar',
                    'topic' => 'Lanjutkan materi bab ' . rand(1, 3),
                    'notes' => 'Tugas halaman 20',
                ]);
            }
        }

        // 11. KBM - Teacher Administrations
        foreach (array_values($teacherIds) as $tId) {
            // Assume the first subject they teach
            $subjectId = array_search($tId, $teacherIds);
            $sId = $subjectIds[$subjectId] ?? null;

            if ($sId) {
                \App\Models\TeacherAdministration::create([
                    'semester_id' => $semester->id,
                    'teacher_id' => $tId,
                    'subject_id' => $sId,
                    // Leaving paths null as they are files, but we can set dummy strings
                    'prota_path' => 'administrations/dummy_prota.pdf',
                    'promes_path' => 'administrations/dummy_promes.pdf',
                ]);
            }

            // 12. KBM - Teacher Evaluations
            \App\Models\TeacherEvaluation::create([
                'teacher_id' => $tId,
                'month' => date('Y-m'),
                'feedback' => 'Evaluasi bulan ini: Performa sangat baik, namun perlu peningkatan dalam penggunaan media pembelajaran interaktif.',
            ]);
        }
    }
}
