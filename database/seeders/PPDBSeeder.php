<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Major;
use App\Models\Applicant;
use Faker\Factory as Faker;
use Illuminate\Support\Str;
use Carbon\Carbon;

class PPDBSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');

        // Seed Majors
        $majors = [
            'Rekayasa Perangkat Lunak',
            'Teknik Komputer dan Jaringan',
            'Multimedia',
            'Akuntansi',
            'Administrasi Perkantoran'
        ];

        $majorIds = [];
        foreach ($majors as $majorName) {
            $major = Major::firstOrCreate(['name' => $majorName]);
            $majorIds[] = $major->id;
        }

        // Seed Applicants
        $statuses = ['pending', 'pending', 'pending', 'reviewed', 'accepted', 'rejected'];
        
        $year = date('Y');

        for ($i = 1; $i <= 20; $i++) {
            $registrationNumber = "REG-{$year}-" . str_pad($i, 4, '0', STR_PAD_LEFT);
            $majorId = $faker->randomElement($majorIds);
            
            Applicant::create([
                'registration_number' => $registrationNumber,
                'full_name' => $faker->name,
                'email' => $faker->unique()->safeEmail,
                'phone' => $faker->phoneNumber,
                'birth_date' => $faker->dateTimeBetween('-18 years', '-15 years')->format('Y-m-d'),
                'address' => $faker->address,
                'major_id' => $majorId,
                'status' => $faker->randomElement($statuses),
                'documents_path' => null, // No files for dummy data, or we could add mock paths
                'created_at' => Carbon::now()->subDays(rand(1, 30)),
            ]);
        }
    }
}
