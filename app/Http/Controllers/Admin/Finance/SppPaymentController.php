<?php

namespace App\Http\Controllers\Admin\Finance;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Finance\SppPaymentRequest;
use App\Repositories\Contracts\Finance\SppPaymentRepositoryInterface;
use App\Repositories\Contracts\SchoolClassRepositoryInterface;
use App\Services\Finance\SppPaymentService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SppPaymentController extends Controller
{
    public function __construct(
        protected SppPaymentRepositoryInterface $sppPaymentRepo,
        protected SppPaymentService $sppPaymentService,
        protected SchoolClassRepositoryInterface $schoolClassRepo
    ) {}

    /**
     * Display the SPP payment index page.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['billing_month', 'status', 'class_id', 'search']);
        
        // Default to current month if not provided explicitly in the query string
        if (!$request->has('billing_month')) {
            $filters['billing_month'] = date('Y-m');
        }

        $payments = $this->sppPaymentRepo->getPaginated(15, $filters);
        $classes = $this->schoolClassRepo->getAll();

        $totalPaidThisMonth = $this->sppPaymentRepo->getTotalPaidForMonth($filters['billing_month']);

        // Computed statistics
        $statusCounts = \App\Models\SppPayment::selectRaw('status, count(*) as count')->groupBy('status')->pluck('count', 'status')->toArray();
        $monthCounts = \App\Models\SppPayment::selectRaw('billing_month, sum(amount) as total')->where('status', 'paid')->groupBy('billing_month')->orderBy('billing_month', 'asc')->limit(6)->pluck('total', 'billing_month')->toArray();

        $statistics = [
            'status_distribution' => array_map(function ($k, $v) { 
                $label = $k === 'paid' ? 'Lunas' : ($k === 'waived' ? 'Dibebaskan' : 'Belum Lunas');
                return ['name' => $label, 'value' => $v]; 
            }, array_keys($statusCounts), array_values($statusCounts)),
            
            'monthly_revenue' => array_map(function ($k, $v) { 
                return ['name' => $k, 'value' => (float) $v]; 
            }, array_keys($monthCounts), array_values($monthCounts))
        ];

        return Inertia::render('Admin/Finance/SPP/Index', [
            'payments' => $payments,
            'classes' => $classes,
            'filters' => $filters,
            'totalPaidThisMonth' => $totalPaidThisMonth,
            'statistics' => $statistics,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    /**
     * Process an SPP payment.
     */
    public function store(SppPaymentRequest $request)
    {
        try {
            $this->sppPaymentService->processPayment($request->validated());

            return back()->with('success', 'Pembayaran SPP berhasil diproses.');
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal memproses pembayaran: ' . $e->getMessage());
        }
    }

    /**
     * Generate SPP bills for the given month (defaults to current month).
     */
    public function generate(Request $request)
    {
        try {
            $month = $request->input('billing_month', date('Y-m'));
            $this->sppPaymentService->generateMonthlyBills($month);

            return back()->with('success', "Tagihan SPP untuk bulan {$month} berhasil digenerate.");
        } catch (\Exception $e) {
            return back()->with('error', 'Gagal meng-generate tagihan: ' . $e->getMessage());
        }
    }
}
