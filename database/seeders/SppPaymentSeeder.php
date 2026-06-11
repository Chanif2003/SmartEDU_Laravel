<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Services\Finance\SppPaymentService;
use Carbon\Carbon;

class SppPaymentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(SppPaymentService $sppPaymentService): void
    {
        // Generate for last month
        $lastMonth = Carbon::now()->subMonth()->format('Y-m');
        $sppPaymentService->generateMonthlyBills($lastMonth);

        // Generate for current month
        $currentMonth = Carbon::now()->format('Y-m');
        $sppPaymentService->generateMonthlyBills($currentMonth);
    }
}
