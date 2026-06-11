<?php

namespace App\Services\Eskul;

use App\Repositories\Eskul\ExtracurricularRepository;

class ExtracurricularService
{
    protected $repository;

    public function __construct(ExtracurricularRepository $repository)
    {
        $this->repository = $repository;
    }

    public function getAllExtracurriculars()
    {
        return $this->repository->getAll();
    }

    public function createExtracurricular(array $data)
    {
        return $this->repository->create($data);
    }

    public function updateExtracurricular($id, array $data)
    {
        return $this->repository->update($id, $data);
    }

    public function deleteExtracurricular($id)
    {
        return $this->repository->delete($id);
    }

    public function syncMembers($id, array $studentIds)
    {
        return $this->repository->syncMembers($id, $studentIds);
    }
}
