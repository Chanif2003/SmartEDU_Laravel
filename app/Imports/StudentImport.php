<?php

namespace App\Imports;

use App\Models\Student;
use App\Models\User;
use App\Models\SchoolClass;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class StudentImport implements ToModel, WithHeadingRow, WithValidation, WithChunkReading
{
    protected ?string $classId;

    public function __construct(?string $classId = null)
    {
        $this->classId = $classId;
    }

    /**
    * @param array $row
    *
    * @return \Illuminate\Database\Eloquent\Model|null
    */
    public function model(array $row)
    {
        try {
            DB::beginTransaction();

            // 1. Create or Find User
            $user = User::firstOrCreate(
                ['email' => $row['email']],
                [
                    'id' => Str::uuid(),
                    'name' => $row['name'],
                    'password' => Hash::make('password123'), // Default password
                    'role' => 'student',
                    'email_verified_at' => now(),
                ]
            );

            // 2. Resolve Class ID
            $resolvedClassId = $this->classId;
            if (!$resolvedClassId && isset($row['class_name'])) {
                $schoolClass = SchoolClass::where('name', $row['class_name'])->first();
                if ($schoolClass) {
                    $resolvedClassId = $schoolClass->id;
                }
            }

            // 3. Create Student
            $student = Student::create([
                'id' => Str::uuid(),
                'user_id' => $user->id,
                'class_id' => $resolvedClassId,
                'name' => $row['name'],
                'nis' => $row['nis'],
                'nisn' => $row['nisn'] ?? null,
                'gender' => strtolower($row['gender']) === 'l' ? 'male' : (strtolower($row['gender']) === 'p' ? 'female' : 'male'),
                'date_of_birth' => isset($row['date_of_birth']) ? date('Y-m-d', strtotime($row['date_of_birth'])) : null,
                'place_of_birth' => $row['place_of_birth'] ?? null,
                'address' => $row['address'] ?? null,
                'phone' => $row['phone'] ?? null,
                'parent_phone' => $row['parent_phone'] ?? null,
                'enrollment_date' => isset($row['enrollment_date']) ? date('Y-m-d', strtotime($row['enrollment_date'])) : now()->format('Y-m-d'),
                'is_active' => true,
            ]);

            DB::commit();
            return $student;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Student Import Row Failed: ' . $e->getMessage(), ['row' => $row]);
            return null; // Skip this row
        }
    }

    public function rules(): array
    {
        return [
            'email' => 'required|email|unique:users,email',
            'name' => 'required|string|max:255',
            'nis' => 'required|string|unique:students,nis',
            'gender' => 'required|in:L,P,l,p,male,female,Male,Female',
        ];
    }

    public function chunkSize(): int
    {
        return 100; // Process 100 rows per chunk
    }
}
