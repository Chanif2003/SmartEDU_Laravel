<?php

namespace App\Services\MasterData;

use App\Repositories\Contracts\TimeSlotRepositoryInterface;

class TimeSlotService
{
    protected $TimeSlotRepository;

    public function __construct(TimeSlotRepositoryInterface $TimeSlotRepository)
    {
        $this->TimeSlotRepository = $TimeSlotRepository;
    }

    public function getPaginated(int $perPage = 15, array $filters = [])
    {
        return $this->TimeSlotRepository->paginate($perPage, $filters);
    }

    public function find(string $id)
    {
        return $this->TimeSlotRepository->find($id);
    }

    public function create(array $data)
    {
        // Add specific business logic here
        return $this->TimeSlotRepository->create($data);
    }

    public function update(string $id, array $data)
    {
        // Add specific business logic here
        return $this->TimeSlotRepository->update($id, $data);
    }

    public function delete(string $id)
    {
        // Add specific business logic here
        return $this->TimeSlotRepository->delete($id);
    }
}
