<?php

namespace App\Services;

use App\Models\NotificationLog;
use Illuminate\Support\Facades\Http;
use Exception;

class WhatsAppService
{
    protected $baseUrl;

    public function __construct()
    {
        $baseUrl = config('services.whatsapp.url', 'http://localhost:3001/api/wa');
        $token = config('services.whatsapp.token');
        
        // Jika menggunakan format token dari gateway: https://[domain]/api/laravel/{$token}
        if (!empty($token)) {
            $this->baseUrl = rtrim($baseUrl, '/') . '/' . trim($token, '/');
        } else {
            $this->baseUrl = rtrim($baseUrl, '/');
        }
    }

    public function getStatus()
    {
        try {
            $response = Http::withoutVerifying()->timeout(5)->get($this->baseUrl . '/status');
            if ($response->successful()) {
                $data = $response->json();
                
                if (!is_array($data)) {
                    $data = [];
                }
                
                // Normalisasi struktur dari API pihak ketiga / eksternal
                if (!isset($data['state'])) {
                    $status = $data['status'] ?? '';
                    if (in_array($status, ['connected', 'authenticated', 'open'])) {
                        $data['state'] = 'open';
                    } elseif (isset($data['hasSession']) && $data['hasSession'] === false) {
                        // Jika tidak ada sesi (baik statusnya disconnected atau qr_ready), paksa masuk ke mode QR
                        $data['state'] = 'qr';
                    } else {
                        $data['state'] = $status ?: 'offline';
                    }
                }

                return $data;
            }
            throw new Exception('API merespon dengan status: ' . $response->status());
        } catch (\Exception $e) {
            return [
                'state' => 'error_detail',
                'hasSession' => false,
                'error' => $e->getMessage(),
                'url' => $this->baseUrl
            ];
        }
    }

    public function getQrCode()
    {
        try {
            $response = Http::withoutVerifying()->timeout(5)->get($this->baseUrl . '/qr');
            if ($response->successful()) {
                return $response->json();
            }
            
            $data = $response->json();
            throw new Exception($data['error'] ?? 'Gagal mendapatkan QR Code.');
        } catch (\Exception $e) {
            throw new Exception($e->getMessage());
        }
    }

    public function logout()
    {
        try {
            $response = Http::withoutVerifying()->timeout(10)->post($this->baseUrl . '/logout');
            if ($response->successful()) {
                return $response->json();
            }
            throw new Exception('Gagal memutus sesi WhatsApp.');
        } catch (\Exception $e) {
            throw new Exception($e->getMessage());
        }
    }

    public function sendMessage(string $number, string $message, string $recipientName = null)
    {
        $log = NotificationLog::create([
            'type' => 'whatsapp',
            'recipient_number' => $number,
            'recipient_name' => $recipientName,
            'message_content' => $message,
            'status' => 'pending',
        ]);

        try {
            $response = Http::withoutVerifying()->timeout(15)->post($this->baseUrl . '/send', [
                'number' => $number,
                'message' => $message
            ]);

            if ($response->successful()) {
                $log->update(['status' => 'sent']);
                return true;
            }

            $errorData = $response->json();
            throw new Exception($errorData['error'] ?? 'Unknown error from WA Service');

        } catch (\Exception $e) {
            $log->update([
                'status' => 'failed',
                'error_message' => $e->getMessage()
            ]);
            throw new Exception('Gagal mengirim pesan WA: ' . $e->getMessage());
        }
    }
}
