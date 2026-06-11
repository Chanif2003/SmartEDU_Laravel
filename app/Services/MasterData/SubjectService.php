<?php

namespace App\Services\MasterData;

use App\Repositories\Contracts\SubjectRepositoryInterface;

class SubjectService
{
    protected $SubjectRepository;

    public function __construct(SubjectRepositoryInterface $SubjectRepository)
    {
        $this->SubjectRepository = $SubjectRepository;
    }

    public function getPaginated(int $perPage = 15, array $filters = [])
    {
        return $this->SubjectRepository->paginate($perPage, $filters);
    }

    public function find(string $id)
    {
        return $this->SubjectRepository->find($id);
    }

    public function create(array $data)
    {
        // Add specific business logic here
        return $this->SubjectRepository->create($data);
    }

    public function update(string $id, array $data)
    {
        // Add specific business logic here
        return $this->SubjectRepository->update($id, $data);
    }

    public function delete(string $id)
    {
        // Add specific business logic here
        return $this->SubjectRepository->delete($id);
    }
}
