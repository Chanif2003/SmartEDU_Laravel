<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Admin
        User::updateOrCreate(
            ['username' => 'admin'],
            [
                'name' => 'Admin Utama',
                'email' => 'admin@edumapper.com',
                'password' => bcrypt('password123'),
                'role' => 'admin',
                'is_active' => true,
            ]
        );

        // 2. Teacher
        $teacherUser = User::updateOrCreate(
            ['username' => '198001012005011001'],
            [
                'name' => 'Budi Santoso',
                'email' => 'budi@edumapper.com',
                'password' => bcrypt('password123'),
                'role' => 'teacher',
                'is_active' => true,
            ]
        );

        \App\Models\Teacher::updateOrCreate(
            ['user_id' => $teacherUser->id],
            [
                'nip' => '198001012005011001',
                'nama_lengkap' => 'Budi Santoso, S.Pd',
            ]
        );

        // 3. Student
        $studentUser = User::updateOrCreate(
            ['username' => '1234567890'],
            [
                'name' => 'Ahmad Fulan',
                'email' => 'ahmad@edumapper.com',
                'password' => bcrypt('password123'),
                'role' => 'student',
                'is_active' => true,
            ]
        );

        $major = \App\Models\Major::firstOrCreate(
            ['name' => 'Rekayasa Perangkat Lunak'],
            ['description' => 'Jurusan Pemrograman dan Software']
        );

        \App\Models\Student::updateOrCreate(
            ['user_id' => $studentUser->id],
            [
                'nisn' => '1234567890',
                'nama_lengkap' => 'Ahmad Fulan',
                'major_id' => $major->id,
            ]
        );

        $this->call([
            DummyDataSeeder::class,
            PPDBSeeder::class,
            StudentBiodataSeeder::class,
            BukuIndukAdditionalDataSeeder::class,
            BukuIndukTranscriptSeeder::class,
            SppPaymentSeeder::class,
            AssessmentSeeder::class,
            InventorySeeder::class,
            NotificationLogSeeder::class,
            TracerStudySeeder::class,
            AppSettingSeeder::class,
        ]);
    }
}
