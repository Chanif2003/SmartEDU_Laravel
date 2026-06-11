<?php

namespace App\Services\MasterData;

use App\Repositories\Contracts\StaffRepositoryInterface;

class StaffService
{
    public function __construct(
        protected StaffRepositoryInterface $staffRepo
    ) {}

    public function getPaginatedStaff(int $perPage = 10, array $filters = [])
    {
        return $this->staffRepo->getPaginated($perPage, $filters);
    }

    public function getStaffById(string $id)
    {
        return $this->staffRepo->find($id);
    }

    public function createStaff(array $data)
    {
        return $this->staffRepo->create($data);
    }

    public function updateStaff(string $id, array $data)
    {
        return $this->staffRepo->update($id, $data);
    }

    public function deleteStaff(string $id)
    {
        return $this->staffRepo->delete($id);
    }
}
