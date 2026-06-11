<?php

namespace App\Imports;

use App\Models\Subject;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use Illuminate\Support\Facades\Log;

class SubjectImport implements ToModel, WithHeadingRow, WithValidation, WithChunkReading
{
    public function model(array $row)
    {
        try {
            return Subject::firstOrCreate(
                ['name' => $row['nama_mata_pelajaran']],
                ['id' => Str::uuid()]
            );
        } catch (\Exception $e) {
            Log::error('Subject Import Row Failed: ' . $e->getMessage(), ['row' => $row]);
            return null;
        }
    }

    public function rules(): array
    {
        return [
            'nama_mata_pelajaran' => 'required|string|max:255',
        ];
    }

    public function chunkSize(): int
    {
        return 100;
    }
}
