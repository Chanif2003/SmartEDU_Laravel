<?php

namespace App\Exports;

use App\Models\SchoolClass;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class SchoolClassExport implements FromQuery, WithHeadings, WithMapping
{
    public function query()
    {
        return SchoolClass::query();
    }

    public function headings(): array
    {
        return [
            'Nama Kelas',
            'Tingkat Kelas',
        ];
    }

    public function map($schoolClass): array
    {
        return [
            $schoolClass->name,
            $schoolClass->grade_level,
        ];
    }
}
