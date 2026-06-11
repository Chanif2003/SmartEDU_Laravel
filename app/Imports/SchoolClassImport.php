<?php

namespace App\Imports;

use App\Models\SchoolClass;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Illuminate\Support\Facades\Log;

class SchoolClassImport implements ToModel, WithHeadingRow, WithValidation, WithChunkReading
{
    public function model(array $row)
    {
        try {
            return SchoolClass::firstOrCreate(
                ['name' => $row['nama_kelas']],
                [
                    'id' => Str::uuid(),
                    'grade_level' => $row['tingkat_kelas']
                ]
            );
        } catch (\Exception $e) {
            Log::error('SchoolClass Import Row Failed: ' . $e->getMessage(), ['row' => $row]);
            return null;
        }
    }

    public function rules(): array
    {
        return [
            'nama_kelas' => 'required|string|max:255',
            'tingkat_kelas' => 'required|string|max:255',
        ];
    }

    public function chunkSize(): int
    {
        return 100;
    }
}
