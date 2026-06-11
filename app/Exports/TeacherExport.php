<?php

namespace App\Exports;

use App\Models\Teacher;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class TeacherExport implements FromQuery, WithHeadings, WithMapping
{
    public function query()
    {
        return Teacher::query()->with('user');
    }

    public function headings(): array
    {
        return [
            'NIP',
            'Nama Lengkap',
            'Email',
        ];
    }

    public function map($teacher): array
    {
        return [
            $teacher->nip,
            $teacher->nama_lengkap,
            $teacher->user->email ?? '',
        ];
    }
}
