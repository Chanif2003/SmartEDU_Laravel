<div align="center">
  <img src="public/logo.png" alt="EduMapper Logo" width="150" height="150" style="border-radius: 20px" onerror="this.src='https://via.placeholder.com/150?text=EduMapper'" />
  <h1>EduMapper Sekolah</h1>
  <p><strong>Sistem Informasi Manajemen Sekolah Terpadu (School Management System)</strong></p>
  <p>EduMapper adalah platform digital komprehensif yang dirancang untuk modernisasi dan digitalisasi administrasi, akademik, kesiswaan, dan pelaporan di lingkungan institusi pendidikan.</p>
</div>

---

## 🌟 Daftar Isi
- [Arsitektur & Teknologi](#-arsitektur--teknologi)
- [Modul & Fitur Utama](#-modul--fitur-utama)
- [Keamanan & Aksesibilitas](#-keamanan--aksesibilitas)
- [Desain & UI/UX](#-desain--uiux)
- [Panduan Instalasi (Setup)](#-panduan-instalasi-setup)
- [Struktur Direktori Utama](#-struktur-direktori-utama)

---

## 🏗 Arsitektur & Teknologi

EduMapper dikembangkan dengan pendekatan *Monolith modern* menggunakan paradigma **Inertia.js** yang menggabungkan kekuatan backend tradisional (Laravel) dengan interaktivitas SPA (Single Page Application) dari React tanpa kerumitan membangun API RESTful yang terpisah.

### **Tech Stack**
- **Backend:** Laravel 11.x (PHP 8.2+)
- **Frontend:** React 18 (dengan Vite)
- **Routing & SSR:** Inertia.js (menghubungkan Laravel & React secara *seamless*)
- **Database:** MySQL / MariaDB
- **Styling:** Tailwind CSS 3 (dengan preset modern & utilitas khusus)
- **Animasi:** Framer Motion (untuk transisi antar halaman & interaksi micro)
- **Ikonografi:** Lucide React
- **Visualisasi Data:** Recharts (untuk grafik, chart, dan metrik dashboard)
- **Notifikasi:** Terintegrasi dengan *WhatsApp API Gateway* (Baileys)

---

## 🚀 Modul & Fitur Utama

Aplikasi ini dibagi menjadi beberapa modul utama yang saling terintegrasi:

### 1. 📊 Master Data Terpadu (Unified Index)
Sistem pengelolaan data inti yang dikemas dalam antarmuka *tabbing* yang cepat dan dinamis:
- **Siswa & Alumni:** Buku Induk, transkrip, mutasi, pelacakan alumni (Tracer Study).
- **Guru & Staf:** Manajemen NIP, penugasan, administrasi (Prota/Promes), dan KPI/Evaluasi Kinerja.
- **Akademik Dasar:** Pengelolaan Mata Pelajaran, Jam Pelajaran (Time Slots), Semester, Kelas, dan Jurusan (Major).

### 2. 📝 PPDB (Penerimaan Peserta Didik Baru) Terintegrasi
- **Portal Pendaftaran:** Landing page dinamis untuk calon siswa mendaftar secara mandiri.
- **Dashboard Admin:** Sistem seleksi (Pending, Reviewed, Accepted, Rejected), verifikasi berkas, dan pemilihan jurusan.
- **Export Data:** Fitur rekapitulasi data pendaftar dalam bentuk file CSV/Excel.

### 3. 🏫 Manajemen Akademik (KBM)
- **Penjadwalan:** Pemetaan jadwal pelajaran cerdas berdasarkan kelas, guru, dan ruangan.
- **Jurnal Mengajar:** Catatan harian guru, pencatatan materi (Topik), absensi kelas per sesi KBM.
- **Guru Inval (Substitusi):** Manajemen pergantian jadwal jika guru utama berhalangan hadir.
- **Penilaian & Rapor:** Penginputan nilai (Formatif/Sumatif), perhitungan bobot, hingga pencetakan E-Rapor (PDF).

### 4. 👥 Manajemen Kesiswaan
- **Ekstrakurikuler:** Pengelolaan program eskul, pendaftaran siswa, dan pelacakan absensi eskul.
- **Poin Pelanggaran:** Pencatatan kedisiplinan, sistem poin, dan sanksi siswa.
- **Presensi Harian:** Pencatatan kehadiran harian siswa terpadu.

### 5. 💰 Keuangan & Inventaris
- **Pembayaran SPP:** Pelacakan tunggakan, riwayat pembayaran, cetak kuitansi.
- **Inventaris Sekolah:** Pelacakan sarana & prasarana, ruang, dan kondisi barang.

### 6. 📱 Integrasi WhatsApp API
- Dashboard khusus untuk menghubungkan sistem ke WhatsApp (menampilkan *QR Code* real-time).
- Pengiriman notifikasi otomatis untuk: tagihan SPP, presensi siswa, OTP, pengumuman sekolah.
- Dilengkapi dengan *Notification Log* untuk melacak status pengiriman pesan.

### 7. 📈 Pelaporan & Dashboard Global (Analytics)
- **Admin Dashboard:** Menampilkan metrik *real-time* distribusi siswa per jurusan, tingkat kehadiran, tren PPDB, dan performa keuangan.
- **Teacher Dashboard:** Jadwal mengajar harian, daftar tugas administrasi, evaluasi kinerja.
- **Student Dashboard:** Menampilkan rapor nilai, jadwal pelajaran, riwayat SPP, dan poin pelanggaran.

---

## 🔒 Keamanan & Aksesibilitas

EduMapper menempatkan keamanan data institusi sebagai prioritas:

1. **Role-Based Access Control (RBAC):**
   Akses sistem dibagi dengan ketat menjadi 4 peran (*roles*):
   - **Admin:** Memiliki kontrol penuh terhadap semua sistem dan pengaturan.
   - **Teacher (Guru):** Mengelola jadwal, jurnal, nilai, dan absensi di kelas yang diampunya.
   - **Staff (Tata Usaha):** Mengelola keuangan (SPP), Inventaris, dan pendaftaran PPDB.
   - **Student (Siswa/Alumni):** Hanya dapat melihat rapor, jadwal individu, dan informasi pribadi.

2. **Middleware Protection:**
   Setiap rute (route) dilindungi dengan Middleware Laravel yang memeriksa autentikasi (`auth`) dan peran spesifik (`role:admin`, dll).

3. **CSRF & XSS Protection:**
   Inertia.js secara otomatis menangani verifikasi token CSRF bawaan Laravel pada setiap *request*. Output data di *frontend* dieksekusi secara aman menggunakan JSX React untuk mencegah injeksi XSS.

4. **Validasi Request Ketat:**
   Setiap input pengguna baik dari Formulir React maupun API tervalidasi menggunakan `Form Request Validation` di sisi server (Laravel).

---

## 🎨 Desain & UI/UX

EduMapper dirancang untuk menolak tampilan kaku perangkat lunak sekolah pada umumnya. EduMapper mengusung gaya desain modern:
- **Glassmorphism & Blur Effects:** Digunakan secara halus pada kartu informasi, modal, dan navbar.
- **Gradients & Ambient Backgrounds:** Penggunaan latar belakang gradasi yang elegan dan tidak mengganggu.
- **Micro-Animations:** Diberdayakan oleh *Framer Motion*, memberikan umpan balik (feedback) visual pada setiap klik, transisi halaman, dan *hover state* untuk pengalaman navigasi yang mulus dan *native-like*.
- **Responsive:** Berjalan sempurna dan proporsional di peramban Desktop, Tablet, maupun Layar Sentuh (*Mobile*).

---

## ⚙️ Panduan Instalasi (Setup)

### Persyaratan Sistem
- **PHP** ^8.2
- **Composer** (Package Manager)
- **Node.js** ^18.0 & **NPM**
- **MySQL** / MariaDB

### Langkah-langkah
1. **Kloning Repositori**
   ```bash
   git clone [URL-REPO]
   cd edumapper-laravel
   ```

2. **Instalasi Dependencies**
   ```bash
   # Install PHP dependencies
   composer install

   # Install Frontend dependencies
   npm install
   ```

3. **Konfigurasi Lingkungan (.env)**
   Duplikat file `.env.example` menjadi `.env`. Sesuaikan kredensial koneksi Database (`DB_DATABASE`, `DB_USERNAME`, dll) dan kunci rahasia integrasi WhatsApp.
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Migrasi & Seeding Database (Penting!)**
   Jalankan migrasi untuk membangun skema beserta data dummy awal. Data dummy ini secara otomatis men-*generate* Master Data, Siswa, Guru, Jadwal, Jurusan, dll.
   ```bash
   php artisan migrate:fresh --seed
   ```

5. **Jalankan Aplikasi Lokal**
   Anda membutuhkan dua terminal yang berjalan secara bersamaan:
   
   **Terminal 1 (Backend):**
   ```bash
   php artisan serve
   ```
   **Terminal 2 (Frontend/Vite):**
   ```bash
   npm run dev
   ```
   
   Aplikasi akan dapat diakses di: `http://localhost:8000`

### Akun Dummy (Hasil Seeder)
- **Admin Utama:** 
  - Username/Email: `admin` / `admin@edumapper.com`
  - Password: `password123`
- **Guru:**
  - Username: `198001012005011001` (NIP)
  - Password: `password123`
- **Siswa:**
  - Username: `1234567890` (NISN)
  - Password: `password123`

*(Terdapat juga puluhan akun guru dan siswa ter-generate acak melalui DummyDataSeeder dengan default password: `password`)*

---

## 📂 Struktur Direktori Utama

```text
edumapper-laravel/
├── app/
│   ├── Http/Controllers/    # Logika Backend (Admin, KBM, PPDB, dll)
│   ├── Models/              # Representasi tabel Eloquent
│   └── Services/            # Logika Bisnis (WhatsAppService, ExportService)
├── database/
│   ├── migrations/          # Skema Database (Siswa, Rapor, Jurnal, SPP, dll)
│   └── seeders/             # Injeksi Data Dummy & Konfigurasi Default
├── public/                  # Assets (Logo, Images, Vite build files)
├── resources/
│   └── js/                  # Seluruh Ekosistem Frontend (React + Inertia)
│       ├── Components/      # Komponen UI Reusable (Modal, Chart, Button)
│       ├── Layouts/         # Tata Letak Utama (Authenticated, Guest)
│       └── Pages/           # Halaman Spesifik Sistem (Dashboard, MasterData, PPDB)
├── routes/
│   ├── web.php              # Definisi Rute Aplikasi
│   └── api.php              # Rute API Khusus (Contoh: Webhook WA)
└── tailwind.config.js       # Konfigurasi Tema & Utilities CSS
```

---
*Dibuat dengan ❤️ untuk kemajuan pendidikan.*
