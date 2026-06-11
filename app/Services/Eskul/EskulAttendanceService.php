<?php

namespace App\Services\Eskul;

use App\Repositories\Eskul\EskulAttendanceRepository;

class EskulAttendanceService
{
    protected $repository;

    public function __construct(EskulAttendanceRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getAllAttendances()
    {
        return $this->repository->getAll();
    }

    public function createAttendance(array $data)
    {
        return $this->repository->create($data);
    }
}
