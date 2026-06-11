<?php

namespace App\Repositories\Contracts\Finance;

use Illuminate\Database\Eloquent\Collection;

interface SppPaymentRepositoryInterface
{
    /**
     * Get paginated SPP payments with filters.
     */
    public function getPaginated(int $perPage = 15, array $filters = []);

    /**
     * Find SPP payment by ID.
     */
    public function findById(string $id);

    /**
     * Check if a payment for a student and month already exists.
     */
    public function findByStudentAndMonth(string $studentId, string $billingMonth);

    /**
     * Get summary of total paid amount for a given month.
     */
    public function getTotalPaidForMonth(?string $billingMonth): float;



    /**
     * Create a new SPP payment.
     */
    public function create(array $data);

    /**
     * Update an existing SPP payment.
     */
    public function update(string $id, array $data);
}
