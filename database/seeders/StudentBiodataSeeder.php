<?php

namespace Database\Seeders;

use App\Models\Student;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class StudentBiodataSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        $students = Student::all();
        
        foreach ($students as $student) {
            $student->update([
                'tempat_lahir' => $faker->city,
                'tanggal_lahir' => $faker->dateTimeBetween('-18 years', '-15 years')->format('Y-m-d'),
                'agama' => $faker->randomElement(['Islam', 'Kristen', 'Katolik', 'Hindu', 'Buddha']),
                'alamat' => $faker->address,
                'no_telepon' => $faker->phoneNumber,
                'nama_ayah' => $faker->name('male'),
                'nama_ibu' => $faker->name('female'),
                'nama_wali' => $faker->optional(0.2)->name,
                'no_telepon_ortu' => $faker->phoneNumber,
                // Default data for Buku Induk
                'registration_type' => $faker->randomElement(['baru', 'baru', 'baru', 'pindahan']),
                'origin_school' => 'SMP Negeri ' . $faker->numberBetween(1, 10) . ' ' . $faker->city,
                'entry_date' => '2023-07-15',
                'notes_buku_induk' => $faker->optional(0.3)->sentence,
            ]);
        }
    }
}
