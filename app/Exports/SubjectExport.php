<?php

namespace App\Exports;

use App\Models\Subject;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class SubjectExport implements FromQuery, WithHeadings, WithMapping
{
    public function query()
    {
        return Subject::query();
    }

    public function headings(): array
    {
        return [
            'Nama Mata Pelajaran',
        ];
    }

    public function map($subject): array
    {
        return [
            $subject->name,
        ];
    }
}
