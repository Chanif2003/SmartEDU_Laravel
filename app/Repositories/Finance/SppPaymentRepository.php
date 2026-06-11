<?php

namespace App\Repositories\Finance;

use App\Models\SppPayment;
use App\Repositories\Contracts\Finance\SppPaymentRepositoryInterface;

class SppPaymentRepository implements SppPaymentRepositoryInterface
{
    public function getPaginated(int $perPage = 15, array $filters = [])
    {
        $query = SppPayment::with([
            'student' => function ($q) {
                $q->withCount(['sppPayments as unpaid_months' => function ($q2) {
                    $q2->where('status', 'unpaid');
                }]);
            },
            'student.schoolClass', 
            'student.user'
        ]);

        if (!empty($filters['billing_month'])) {
            $query->where('billing_month', $filters['billing_month']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['class_id'])) {
            $query->whereHas('student', function ($q) use ($filters) {
                $q->where('class_id', $filters['class_id']);
            });
        }

        if (!empty($filters['search'])) {
            $query->whereHas('student', function ($q) use ($filters) {
                $q->where('nama_lengkap', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('nisn', 'like', '%' . $filters['search'] . '%');
            });
        }

        // Default order by latest
        $query->orderBy('created_at', 'desc');

        return $query->paginate($perPage);
    }

    public function findById(string $id)
    {
        return SppPayment::findOrFail($id);
    }

    public function findByStudentAndMonth(string $studentId, string $billingMonth)
    {
        return SppPayment::where('student_id', $studentId)
                         ->where('billing_month', $billingMonth)
                         ->first();
    }

    public function getTotalPaidForMonth(?string $billingMonth): float
    {
        if (empty($billingMonth)) {
            return 0.0;
        }
        return (float) SppPayment::where('billing_month', $billingMonth)
                                 ->where('status', 'paid')
                                 ->sum('amount');
    }

    public function create(array $data)
    {
        return SppPayment::create($data);
    }

    public function update(string $id, array $data)
    {
        $payment = $this->findById($id);
        $payment->update($data);
        return $payment;
    }

}
