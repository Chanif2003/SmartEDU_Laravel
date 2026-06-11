<?php

namespace App\Services\Admin\Academic;

use App\Repositories\Contracts\Admin\Academic\SubstitutionRepositoryInterface;
use Illuminate\Support\Facades\Log;

class SubstitutionService
{
    protected $repository;

    public function __construct(SubstitutionRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function getAll(int $perPage = 10, array $filters = [])
    {
        return $this->repository->getAllPaginated($perPage, $filters);
    }

    public function create(array $data)
    {
        try {
            return $this->repository->create($data);
        } catch (\Exception $e) {
            Log::error('Error creating Substitution: ' . $e->getMessage());
            throw $e;
        }
    }

    public function update(string $id, array $data)
    {
        try {
            return $this->repository->update($id, $data);
        } catch (\Exception $e) {
            Log::error('Error updating Substitution: ' . $e->getMessage());
            throw $e;
        }
    }

    public function delete(string $id)
    {
        try {
            return $this->repository->delete($id);
        } catch (\Exception $e) {
            Log::error('Error deleting Substitution: ' . $e->getMessage());
            throw $e;
        }
    }
}
