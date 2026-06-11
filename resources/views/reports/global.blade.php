<!DOCTYPE html>
<html>
<head>
    <title>Laporan Global</title>
    <style>
        body { font-family: sans-serif; font-size: 14px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
        .title { font-size: 24px; font-weight: bold; color: #1e3a8a; margin: 0; }
        .subtitle { font-size: 14px; color: #64748b; margin-top: 5px; }
        .section-title { font-size: 18px; font-weight: bold; margin-top: 30px; margin-bottom: 15px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; color: #0f172a; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
        th { background-color: #f8fafc; font-weight: bold; color: #475569; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
    </style>
</head>
<body>

    <div class="header">
        <h1 class="title">LAPORAN REKAPITULASI SEKOLAH</h1>
        <p class="subtitle">Periode: {{ \Carbon\Carbon::parse($start_date)->translatedFormat('d F Y') }} - {{ \Carbon\Carbon::parse($end_date)->translatedFormat('d F Y') }}</p>
    </div>

    @if(isset($attendance))
    <h2 class="section-title">1. Rekapitulasi Kehadiran (Presensi)</h2>
    <table>
        <thead>
            <tr>
                <th>Status Kehadiran</th>
                <th class="text-center">Jumlah Kejadian</th>
            </tr>
        </thead>
        <tbody>
            @foreach($attendance as $item)
            <tr>
                <td>{{ $item['name'] }}</td>
                <td class="text-center">{{ $item['value'] }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif

    @if(isset($finance))
    <h2 class="section-title">2. Laporan Pemasukan SPP</h2>
    <table>
        <thead>
            <tr>
                <th>Bulan Tagihan</th>
                <th class="text-center">Jumlah Siswa Lunas</th>
                <th class="text-right">Total Pemasukan (Rp)</th>
            </tr>
        </thead>
        <tbody>
            @php $totalAmount = 0; @endphp
            @foreach($finance as $item)
            @php $totalAmount += $item->total_income; @endphp
            <tr>
                <td>{{ $item->billing_month }}</td>
                <td class="text-center">{{ $item->total_students }}</td>
                <td class="text-right">{{ number_format($item->total_income, 2, ',', '.') }}</td>
            </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr>
                <th colspan="2" class="text-right">Total Keseluruhan</th>
                <th class="text-right">{{ number_format($totalAmount, 2, ',', '.') }}</th>
            </tr>
        </tfoot>
    </table>
    @endif

    @if(isset($violations))
    <h2 class="section-title">3. Statistik Kedisiplinan & Pelanggaran</h2>
    <table>
        <thead>
            <tr>
                <th>Tingkat Pelanggaran</th>
                <th class="text-center">Jumlah Kasus</th>
            </tr>
        </thead>
        <tbody>
            @foreach($violations['byType'] as $item)
            <tr>
                <td style="text-transform: capitalize;">{{ $item->violation_type }}</td>
                <td class="text-center">{{ $item->total }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <h3 style="font-size: 14px; margin-top: 15px;">Tren Pelanggaran</h3>
    <table>
        <thead>
            <tr>
                <th>Tanggal</th>
                <th class="text-center">Total Kasus</th>
            </tr>
        </thead>
        <tbody>
            @foreach($violations['trend'] as $item)
            <tr>
                <td>{{ \Carbon\Carbon::parse($item->date)->translatedFormat('d F Y') }}</td>
                <td class="text-center">{{ $item->total }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif

    @if(isset($evaluations))
    <h2 class="section-title">4. Evaluasi & KPI Guru</h2>
    <table>
        <thead>
            <tr>
                <th>Bulan</th>
                <th class="text-center">Total Evaluasi</th>
                <th class="text-center">Rata-rata Nilai</th>
            </tr>
        </thead>
        <tbody>
            @foreach($evaluations['trend'] as $item)
            <tr>
                <td>{{ \Carbon\Carbon::parse($item->month . '-01')->translatedFormat('F Y') }}</td>
                <td class="text-center">{{ $item->total_evaluations }}</td>
                <td class="text-center">{{ number_format($item->average_score, 1) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <h3 style="font-size: 14px; margin-top: 15px;">Top 5 Guru (Nilai Tertinggi)</h3>
    <table>
        <thead>
            <tr>
                <th>Nama Guru</th>
                <th class="text-center">Nilai Rata-rata</th>
            </tr>
        </thead>
        <tbody>
            @foreach($evaluations['topTeachers'] as $item)
            <tr>
                <td>{{ $item->teacher->nama_lengkap ?? 'Unknown' }}</td>
                <td class="text-center">{{ number_format($item->average_score, 1) }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
    @endif

    <div style="margin-top: 50px; text-align: right;">
        <p>Dicetak pada: {{ now()->translatedFormat('d F Y H:i:s') }}</p>
    </div>

</body>
</html>
