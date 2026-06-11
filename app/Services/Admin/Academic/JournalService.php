<?php

namespace App\Services\Admin\Academic;

use App\Repositories\Contracts\Admin\Academic\JournalRepositoryInterface;
use Illuminate\Support\Facades\Log;

class JournalService
{
    protected $repository;

    public function __construct(JournalRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function getAll(int $perPage = 10, array $filters = [])
    {
        return $this->repository->getAllPaginated($perPage, $filters);
    }

    public function getById(string $id)
    {
        return $this->repository->findById($id);
    }

    public function create(array $data)
    {
        try {
            return $this->repository->create($data);
        } catch (\Exception $e) {
            Log::error('Error creating Journal: ' . $e->getMessage());
            throw $e;
        }
    }

    public function update(string $id, array $data)
    {
        try {
            return $this->repository->update($id, $data);
        } catch (\Exception $e) {
            Log::error('Error updating Journal: ' . $e->getMessage());
            throw $e;
        }
    }

    public function delete(string $id)
    {
        try {
            return $this->repository->delete($id);
        } catch (\Exception $e) {
            Log::error('Error deleting Journal: ' . $e->getMessage());
            throw $e;
        }
    }
}
