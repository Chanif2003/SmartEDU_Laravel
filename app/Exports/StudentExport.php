<?php

namespace App\Exports;

use App\Models\Student;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class StudentExport implements FromQuery, WithHeadings, WithMapping
{
    protected ?string $classId;

    public function __construct(?string $classId = null)
    {
        $this->classId = $classId;
    }

    public function query()
    {
        $query = Student::query()->with(['user', 'schoolClass']);
        
        if ($this->classId) {
            $query->where('class_id', $this->classId);
        }

        return $query;
    }

    public function headings(): array
    {
        return [
            'NIS',
            'NISN',
            'Nama Siswa',
            'Email',
            'Jenis Kelamin',
            'Tanggal Lahir',
            'Tempat Lahir',
            'Alamat',
            'No HP',
            'No HP Ortu',
            'Kelas Saat Ini',
            'Tanggal Masuk',
            'Status'
        ];
    }

    /**
    * @param Student $student
    */
    public function map($student): array
    {
        return [
            $student->nis,
            $student->nisn,
            $student->name,
            $student->user->email ?? '',
            $student->gender === 'male' ? 'L' : 'P',
            $student->date_of_birth ? $student->date_of_birth->format('Y-m-d') : '',
            $student->place_of_birth,
            $student->address,
            $student->phone,
            $student->parent_phone,
            $student->schoolClass->name ?? '',
            $student->enrollment_date ? $student->enrollment_date->format('Y-m-d') : '',
            $student->is_active ? 'Aktif' : 'Non-Aktif',
        ];
    }
}
