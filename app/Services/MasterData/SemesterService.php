<?php

namespace App\Services\MasterData;

use App\Repositories\Contracts\SemesterRepositoryInterface;

class SemesterService
{
    protected $SemesterRepository;

    public function __construct(SemesterRepositoryInterface $SemesterRepository)
    {
        $this->SemesterRepository = $SemesterRepository;
    }

    public function getPaginated(int $perPage = 15, array $filters = [])
    {
        return $this->SemesterRepository->paginate($perPage, $filters);
    }

    public function find(string $id)
    {
        return $this->SemesterRepository->find($id);
    }

    public function create(array $data)
    {
        if (!empty($data['is_active'])) {
            \App\Models\Semester::where('is_active', true)->update(['is_active' => false]);
        }
        return $this->SemesterRepository->create($data);
    }

    public function update(string $id, array $data)
    {
        if (!empty($data['is_active'])) {
            \App\Models\Semester::where('id', '!=', $id)->update(['is_active' => false]);
        }
        return $this->SemesterRepository->update($id, $data);
    }

    public function delete(string $id)
    {
        // Add specific business logic here
        return $this->SemesterRepository->delete($id);
    }
}
