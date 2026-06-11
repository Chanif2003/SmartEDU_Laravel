<!DOCTYPE html>
<html>
<head>
    <title>Raport {{ $student->nama_lengkap }}</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; }
        .header { text-align: center; margin-bottom: 20px; }
        .info-table { width: 100%; margin-bottom: 20px; }
        .info-table td { padding: 4px; }
        .score-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .score-table th, .score-table td { border: 1px solid #000; padding: 8px; }
        .score-table th { background-color: #f0f0f0; }
        .footer-table { width: 100%; margin-top: 40px; text-align: center; }
    </style>
</head>
<body>

    <div class="header">
        <h2>LAPORAN HASIL BELAJAR (RAPORT)</h2>
        <h3>TAHUN AJARAN {{ $semester->academic_year }}</h3>
    </div>

    <table class="info-table">
        <tr>
            <td width="20%">Nama Peserta Didik</td>
            <td width="5%">:</td>
            <td width="45%"><strong>{{ $student->nama_lengkap }}</strong></td>
            <td width="15%">Kelas</td>
            <td width="5%">:</td>
            <td width="10%">{{ $student->schoolClass->name ?? '-' }}</td>
        </tr>
        <tr>
            <td>NISN</td>
            <td>:</td>
            <td>{{ $student->nisn }}</td>
            <td>Semester</td>
            <td>:</td>
            <td>{{ $semester->name }}</td>
        </tr>
    </table>

    <h4>A. Pengetahuan & Keterampilan</h4>
    <table class="score-table">
        <thead>
            <tr>
                <th>No</th>
                <th>Mata Pelajaran</th>
                <th>Capaian Pembelajaran</th>
                <th>Nilai PTS</th>
                <th>Nilai PAS</th>
            </tr>
        </thead>
        <tbody>
            @forelse($scores as $index => $score)
            <tr>
                <td style="text-align: center;">{{ $index + 1 }}</td>
                <td>{{ $score->subject->name ?? '-' }}</td>
                <td>{{ $score->learningObjective->target ?? '-' }}</td>
                <td style="text-align: center;">{{ $score->pts_score ?? '-' }}</td>
                <td style="text-align: center;">{{ $score->pas_score ?? '-' }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="5" style="text-align: center;">Belum ada data nilai.</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <h4>B. Ketidakhadiran</h4>
    <table class="score-table" style="width: 50%;">
        <tr>
            <td>Sakit</td>
            <td style="text-align: center;">{{ $reportCard->sick_days ?? 0 }} hari</td>
        </tr>
        <tr>
            <td>Izin</td>
            <td style="text-align: center;">{{ $reportCard->permission_days ?? 0 }} hari</td>
        </tr>
        <tr>
            <td>Tanpa Keterangan</td>
            <td style="text-align: center;">{{ $reportCard->absent_days ?? 0 }} hari</td>
        </tr>
    </table>

    <h4>C. Catatan Wali Kelas</h4>
    <div style="border: 1px solid #000; padding: 10px; min-height: 50px;">
        {{ $reportCard->notes ?? '-' }}
    </div>

    <table class="footer-table">
        <tr>
            <td width="50%">
                Mengetahui,<br>
                Orang Tua / Wali<br><br><br><br>
                _______________________
            </td>
            <td width="50%">
                Wali Kelas<br><br><br><br>
                _______________________
            </td>
        </tr>
    </table>

</body>
</html>
