<?php

namespace App\Exports;

use App\Models\Staff;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class StaffExport implements FromQuery, WithHeadings, WithMapping
{
    public function query()
    {
        return Staff::query()->with('user');
    }

    public function headings(): array
    {
        return [
            'NIP',
            'Nama Lengkap',
            'Email',
            'Jabatan',
            'No HP',
            'Alamat',
            'Jenis Kelamin'
        ];
    }

    public function map($staff): array
    {
        return [
            $staff->nip,
            $staff->nama_lengkap,
            $staff->user->email ?? '',
            $staff->jabatan,
            $staff->no_hp,
            $staff->alamat,
            $staff->jenis_kelamin,
        ];
    }
}
