<?php

namespace App\Services\Admin\Discipline;

use App\Repositories\Contracts\Admin\Discipline\ViolationRepositoryInterface;
use Illuminate\Support\Facades\Log;

class ViolationService
{
    protected $violationRepository;

    public function __construct(ViolationRepositoryInterface $violationRepository)
    {
        $this->violationRepository = $violationRepository;
    }

    public function getAllViolations(int $perPage = 10, array $filters = [])
    {
        return $this->violationRepository->getAllPaginated($perPage, $filters);
    }

    public function getStudentViolations(string $studentId, int $perPage = 10)
    {
        return $this->violationRepository->getByStudentId($studentId, $perPage);
    }

    public function getStudentTotalPoints(string $studentId)
    {
        return $this->violationRepository->getTotalPointsByStudentId($studentId);
    }

    public function createViolation(array $data)
    {
        try {
            $violation = $this->violationRepository->create($data);
            return $violation;
        } catch (\Exception $e) {
            Log::error('Error creating violation: ' . $e->getMessage());
            throw $e;
        }
    }

    public function updateViolation(string $id, array $data)
    {
        try {
            return $this->violationRepository->update($id, $data);
        } catch (\Exception $e) {
            Log::error('Error updating violation: ' . $e->getMessage());
            throw $e;
        }
    }

    public function deleteViolation(string $id)
    {
        try {
            return $this->violationRepository->delete($id);
        } catch (\Exception $e) {
            Log::error('Error deleting violation: ' . $e->getMessage());
            throw $e;
        }
    }
}
