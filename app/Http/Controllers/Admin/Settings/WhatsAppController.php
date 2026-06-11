<?php

namespace App\Http\Controllers\Admin\Settings;

use App\Http\Controllers\Controller;
use App\Models\NotificationLog;
use App\Services\WhatsAppService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WhatsAppController extends Controller
{
    protected $waService;

    public function __construct(WhatsAppService $waService)
    {
        $this->waService = $waService;
    }

    public function index()
    {
        $status = $this->waService->getStatus();
        
        $logs = NotificationLog::where('type', 'whatsapp')
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Settings/WhatsApp', [
            'waStatus' => $status,
            'logs' => $logs
        ]);
    }

    public function getQr()
    {
        try {
            $response = $this->waService->getQrCode();
            return response()->json($response);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function testMessage(Request $request)
    {
        $request->validate([
            'number' => 'required|string',
            'message' => 'required|string',
        ]);

        try {
            $this->waService->sendMessage($request->number, $request->message, 'Test Admin');
            return back()->with('success', 'Pesan percobaan berhasil dikirim (atau antre di log).');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function logout()
    {
        try {
            $this->waService->logout();
            return back()->with('success', 'Berhasil memutus sesi WhatsApp.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
