<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Surat Keterangan Lulus - {{ $student->nama_lengkap }}</title>
    <style>
        body {
            font-family: 'Times New Roman', Times, serif;
            line-height: 1.5;
            margin: 40px;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #000;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .header h1, .header h2, .header p {
            margin: 0;
            padding: 0;
        }
        .header h1 {
            font-size: 18px;
            text-transform: uppercase;
        }
        .header h2 {
            font-size: 20px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .title {
            text-align: center;
            margin-top: 30px;
            margin-bottom: 30px;
        }
        .title h3 {
            margin: 0;
            text-decoration: underline;
            font-size: 18px;
        }
        .title p {
            margin: 5px 0 0 0;
        }
        .content {
            margin-bottom: 30px;
        }
        .content p {
            text-align: justify;
        }
        .data-table {
            width: 80%;
            margin: 0 auto;
        }
        .data-table td {
            padding: 5px;
            vertical-align: top;
        }
        .data-table td:first-child {
            width: 30%;
        }
        .data-table td:nth-child(2) {
            width: 5%;
        }
        .signature {
            float: right;
            width: 300px;
            margin-top: 50px;
            text-align: left;
        }
        .signature-space {
            height: 100px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>PEMERINTAH PROVINSI</h1>
        <h2>DINAS PENDIDIKAN</h2>
        <h2>SMA/SMK NEGERI 1 NUSANTARA</h2>
        <p>Jl. Pendidikan No. 123, Kota Cerdas, Email: info@smkn1nusantara.sch.id</p>
    </div>

    <div class="title">
        <h3>SURAT KETERANGAN LULUS</h3>
        <p>Nomor: {{ $student->skl_number ?? '...../SKL/'.date('Y') }}</p>
    </div>

    <div class="content">
        <p>Yang bertanda tangan di bawah ini Kepala Sekolah menerangkan dengan sesungguhnya bahwa:</p>

        <table class="data-table">
            <tr>
                <td>Nama Lengkap</td>
                <td>:</td>
                <td><strong>{{ $student->nama_lengkap }}</strong></td>
            </tr>
            <tr>
                <td>Tempat, Tanggal Lahir</td>
                <td>:</td>
                <td>{{ $student->birth_place ?? '-' }}, {{ $student->birth_date ? $student->birth_date->format('d F Y') : '-' }}</td>
            </tr>
            <tr>
                <td>Nomor Induk Siswa (NIS)</td>
                <td>:</td>
                <td>{{ $student->nis ?? '-' }}</td>
            </tr>
            <tr>
                <td>Nomor Induk Siswa Nasional (NISN)</td>
                <td>:</td>
                <td>{{ $student->nisn ?? '-' }}</td>
            </tr>
            <tr>
                <td>Asal Kelas</td>
                <td>:</td>
                <td>{{ $student->schoolClass ? $student->schoolClass->name : '-' }}</td>
            </tr>
        </table>

        <p style="margin-top: 20px;">
            Berdasarkan hasil Rapat Pleno Dewan Guru tentang Penentuan Kelulusan, 
            siswa yang bersangkutan dinyatakan <strong>LULUS</strong> dari Satuan Pendidikan 
            pada Tahun Pelajaran {{ $student->graduation_year ?? date('Y') }} / {{ ($student->graduation_year ?? date('Y')) + 1 }}.
        </p>

        <p>Surat Keterangan Lulus ini berlaku sementara sampai diterbitkannya Ijazah asli. Demikian surat keterangan ini dibuat untuk dapat dipergunakan sebagaimana mestinya.</p>
    </div>

    <div class="signature">
        <p>Kota Cerdas, {{ $student->graduation_date ? $student->graduation_date->format('d F Y') : date('d F Y') }}<br>Kepala Sekolah,</p>
        <div class="signature-space"></div>
        <p><strong><u>Drs. Budi Santoso, M.Pd</u></strong><br>NIP. 19700101 199501 1 001</p>
    </div>

</body>
</html>
