<?php

namespace App\Imports;

use App\Models\Staff;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class StaffImport implements ToModel, WithHeadingRow, WithValidation, WithChunkReading
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
                    'role' => 'staff',
                    'email_verified_at' => now(),
                ]
            );

            $staff = Staff::create([
                'id' => Str::uuid(),
                'user_id' => $user->id,
                'nip' => $row['nip'] ?? null,
                'nama_lengkap' => $row['nama_lengkap'],
                'jabatan' => $row['jabatan'] ?? null,
                'no_hp' => $row['no_hp'] ?? null,
                'alamat' => $row['alamat'] ?? null,
                'jenis_kelamin' => strtolower($row['jenis_kelamin'] ?? 'l') === 'l' ? 'L' : 'P',
            ]);

            DB::commit();
            return $staff;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Staff Import Row Failed: ' . $e->getMessage(), ['row' => $row]);
            return null;
        }
    }

    public function rules(): array
    {
        return [
            'email' => 'required|email|unique:users,email',
            'nama_lengkap' => 'required|string|max:255',
            'nip' => 'nullable|string|unique:staffs,nip',
        ];
    }

    public function chunkSize(): int
    {
        return 100;
    }
}
