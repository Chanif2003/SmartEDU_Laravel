<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;
use Symfony\Component\Process\Process;

class DatabaseController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Settings/Database');
    }

    public function export()
    {
        $database = env('DB_DATABASE');
        $username = env('DB_USERNAME');
        $password = env('DB_PASSWORD');
        $host = env('DB_HOST', '127.0.0.1');
        $port = env('DB_PORT', '3306');
        
        $filename = 'backup_' . date('Y-m-d_H-i-s') . '.sql';
        $path = storage_path('app/' . $filename);

        $passwordParam = $password ? "-p{$password}" : "";
        // Only use mysqldump logic, assuming MySQL
        $command = "mysqldump -h {$host} -P {$port} -u {$username} {$passwordParam} {$database} > {$path}";

        $process = Process::fromShellCommandline($command);
        // Ensure common bin paths are available for mysqldump
        $process->setEnv(['PATH' => getenv('PATH') . ':/usr/local/bin:/opt/homebrew/bin:/Applications/ServBay/bin:/usr/bin:/bin']);
        $process->run();

        if (!$process->isSuccessful()) {
            return back()->withErrors(['error' => 'Gagal mengekspor database: ' . $process->getErrorOutput()]);
        }

        return response()->download($path)->deleteFileAfterSend(true);
    }

    public function import(Request $request)
    {
        $request->validate([
            'sql_file' => 'required|file|max:51200', // 50MB max
        ]);

        $file = $request->file('sql_file');
        $extension = $file->getClientOriginalExtension();
        
        if (strtolower($extension) !== 'sql') {
            return back()->withErrors(['error' => 'File harus berekstensi .sql']);
        }
        
        try {
            $sql = File::get($file->getRealPath());
            DB::unprepared($sql);
            return back()->with('success', 'Database berhasil diimpor.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal mengimpor database: ' . $e->getMessage()]);
        }
    }

    public function reset()
    {
        try {
            // Run migrate:fresh without --seed to keep it completely blank
            Artisan::call('migrate:fresh', ['--force' => true]);

            // Re-create the main admin user so they can still log in
            \App\Models\User::create([
                'name' => 'Admin Utama',
                'username' => 'admin',
                'email' => 'admin@edumapper.com',
                'password' => bcrypt('password123'),
                'role' => 'admin',
                'is_active' => true,
            ]);

            auth()->logout();

            return redirect()->route('login')->with('success', 'Database berhasil direset. Seluruh data (kecuali akun Admin awal) telah dikosongkan. Silakan login kembali.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal mereset database: ' . $e->getMessage()]);
        }
    }
}
