<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Log;

class ReportController extends Controller
{
    protected ReportService $reportService;

    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    public function index()
    {
        return Inertia::render('Admin/Report/Index');
    }

    public function getSummary(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');

        try {
            $attendance = $this->reportService->getAttendanceSummary($startDate, $endDate);
            $finance = $this->reportService->getFinanceSummary($startDate, $endDate);
            $violations = $this->reportService->getViolationsStats($startDate, $endDate);
            $evaluations = $this->reportService->getTeacherKpiStats($startDate, $endDate);

            return response()->json([
                'status' => 'success',
                'data' => [
                    'attendance' => $attendance,
                    'finance' => $finance,
                    'violations' => $violations,
                    'evaluations' => $evaluations,
                ],
                'message' => 'Data laporan berhasil diambil.'
            ], 200);
        } catch (\Exception $e) {
            Log::error('Report Summary Error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Terjadi kesalahan internal saat mengambil data.',
            ], 500);
        }
    }

    public function exportPdf(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'type' => 'required|string|in:all,finance,attendance,violations,evaluations',
        ]);

        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $type = $request->input('type');

        $data = [
            'start_date' => $startDate,
            'end_date' => $endDate,
            'type' => $type,
        ];

        if ($type === 'all' || $type === 'attendance') {
            $data['attendance'] = $this->reportService->getAttendanceSummary($startDate, $endDate);
        }
        if ($type === 'all' || $type === 'finance') {
            $data['finance'] = $this->reportService->getFinanceSummary($startDate, $endDate);
        }
        if ($type === 'all' || $type === 'violations') {
            $data['violations'] = $this->reportService->getViolationsStats($startDate, $endDate);
        }
        if ($type === 'all' || $type === 'evaluations') {
            $data['evaluations'] = $this->reportService->getTeacherKpiStats($startDate, $endDate);
        }

        $pdf = Pdf::loadView('reports.global', $data);
        return $pdf->download('laporan_' . $type . '_' . date('Ymd_His') . '.pdf');
    }
}
