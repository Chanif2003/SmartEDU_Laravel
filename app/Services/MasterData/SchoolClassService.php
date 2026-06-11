<?php

namespace App\Services\MasterData;

use App\Repositories\Contracts\SchoolClassRepositoryInterface;

class SchoolClassService
{
    protected $SchoolClassRepository;

    public function __construct(SchoolClassRepositoryInterface $SchoolClassRepository)
    {
        $this->SchoolClassRepository = $SchoolClassRepository;
    }

    public function getPaginated(int $perPage = 15, array $filters = [])
    {
        return $this->SchoolClassRepository->paginate($perPage, $filters);
    }

    public function find(string $id)
    {
        return $this->SchoolClassRepository->find($id);
    }

    public function create(array $data)
    {
        // Add specific business logic here
        return $this->SchoolClassRepository->create($data);
    }

    public function update(string $id, array $data)
    {
        // Add specific business logic here
        return $this->SchoolClassRepository->update($id, $data);
    }

    public function delete(string $id)
    {
        // Add specific business logic here
        return $this->SchoolClassRepository->delete($id);
    }
}
