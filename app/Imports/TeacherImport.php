<?php

namespace App\Imports;

use App\Models\Teacher;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TeacherImport implements ToModel, WithHeadingRow, WithValidation, WithChunkReading
{
    public function model(array $row)
    {
        try {
            DB::beginTransaction();

            $user = User::firstOrCreate(
                ['email' => $row['email']],
                [
                    'id' => Str::uuid(),
                    'name' => $row['nama_lengkap'],
                    'password' => Hash::make('password123'),
                    'role' => 'teacher',
                    'email_verified_at' => now(),
                ]
            );

            $teacher = Teacher::create([
                'id' => Str::uuid(),
                'user_id' => $user->id,
                'nip' => $row['nip'] ?? null,
                'nama_lengkap' => $row['nama_lengkap'],
            ]);

            DB::commit();
            return $teacher;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Teacher Import Row Failed: ' . $e->getMessage(), ['row' => $row]);
            return null;
        }
    }

    public function rules(): array
    {
        return [
            'email' => 'required|email|unique:users,email',
            'nama_lengkap' => 'required|string|max:255',
            'nip' => 'nullable|string|unique:teachers,nip',
        ];
    }

    public function chunkSize(): int
    {
        return 100;
    }
}
