<?php

namespace App\Services\Finance;

use App\Models\Student;
use App\Repositories\Contracts\Finance\SppPaymentRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Exception;

class SppPaymentService
{
    public function __construct(
        protected SppPaymentRepositoryInterface $sppPaymentRepo
    ) {}

    /**
     * Process an SPP payment (mark as paid).
     */
    public function processPayment(array $data)
    {
        DB::beginTransaction();
        try {
            // Either find existing record or create new if not seeded
            $payment = $this->sppPaymentRepo->findByStudentAndMonth($data['student_id'], $data['billing_month']);

            $paymentData = [
                'student_id' => $data['student_id'],
                'billing_month' => $data['billing_month'],
                'amount' => $data['amount'],
                'status' => 'paid',
                'payment_date' => $data['payment_date'],
                'payment_method' => $data['payment_method'] ?? 'Tunai',
                'notes' => $data['notes'] ?? null,
            ];

            if ($payment) {
                // If it's already paid, throw exception
                if ($payment->status === 'paid') {
                    throw new Exception('Tagihan SPP untuk bulan tersebut sudah dilunasi.');
                }
                $result = $this->sppPaymentRepo->update($payment->id, $paymentData);
            } else {
                $result = $this->sppPaymentRepo->create($paymentData);
            }

            DB::commit();
            return $result;
        } catch (Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    /**
     * Generate unpaid SPP bills for all active students for a given month.
     * This is usually triggered by a Cron job at the 1st of every month.
     */
    public function generateMonthlyBills(string $billingMonth, float $defaultAmount = 250000.00)
    {
        $students = Student::where('is_active', true)->get();
        $generatedCount = 0;

        foreach ($students as $student) {
            $existing = $this->sppPaymentRepo->findByStudentAndMonth($student->id, $billingMonth);
            
            if (!$existing) {
                $this->sppPaymentRepo->create([
                    'student_id' => $student->id,
                    'billing_month' => $billingMonth,
                    'amount' => $defaultAmount,
                    'status' => 'unpaid',
                ]);
                $generatedCount++;
            }
        }

        return $generatedCount;
    }
}
