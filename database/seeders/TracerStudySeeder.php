<?php

namespace Database\Seeders;

use App\Models\Student;
use App\Models\TracerStudy;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class TracerStudySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        TracerStudy::truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
        $faker = Faker::create('id_ID');

        // Update random students to be alumni
        $students = Student::inRandomOrder()->limit(150)->get();

        foreach ($students as $student) {
            $graduationYear = $faker->randomElement(['2020', '2021', '2022', '2023', '2024', '2025', '2026']);
            
            $student->update([
                'is_alumni' => true,
                'graduation_year' => $graduationYear,
                'graduation_date' => $graduationYear . '-06-15',
            ]);

            $status = $faker->randomElement(['working', 'working', 'working', 'studying', 'studying', 'entrepreneur', 'seeking', 'seeking', 'other']);

            $data = [
                'student_id' => $student->id,
                'entry_year' => date('Y'),
                'status' => $status,
                'contact_number' => $faker->phoneNumber,
                'notes' => $faker->optional(0.5)->sentence(),
            ];

            if (in_array($status, ['working', 'studying', 'entrepreneur'])) {
                $data['institution_name'] = $status === 'working' ? $faker->company : ($status === 'studying' ? 'Universitas ' . $faker->city : 'Toko ' . $faker->firstName);
                $data['position_or_major'] = $status === 'working' ? $faker->jobTitle : ($status === 'studying' ? 'Sistem Informasi' : 'Retail');
            }

            if (in_array($status, ['working', 'entrepreneur'])) {
                $data['income_range'] = $faker->randomElement(['< 3 Juta', '3 - 5 Juta', '5 - 10 Juta', '> 10 Juta']);
            }

            TracerStudy::create($data);
        }
    }
}
