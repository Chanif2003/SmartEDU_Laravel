<?php

namespace App\Services\Eskul;

use App\Repositories\Eskul\EskulScheduleRepository;

class EskulScheduleService
{
    protected $repository;

    public function __construct(EskulScheduleRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getAllSchedules()
    {
        return $this->repository->getAll();
    }

    public function createSchedule(array $data)
    {
        return $this->repository->create($data);
    }

    public function updateSchedule($id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    public function deleteSchedule($id)
    {
        return $this->repository->delete($id);
    }
}
