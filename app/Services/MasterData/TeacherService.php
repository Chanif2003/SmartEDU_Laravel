<?php

namespace App\Services\MasterData;

use App\Repositories\Contracts\TeacherRepositoryInterface;

class TeacherService
{
    protected $TeacherRepository;

    public function __construct(TeacherRepositoryInterface $TeacherRepository)
    {
        $this->TeacherRepository = $TeacherRepository;
    }

    public function getPaginated(int $perPage = 15, array $filters = [])
    {
        return $this->TeacherRepository->paginate($perPage, $filters);
    }

    public function find(string $id)
    {
        return $this->TeacherRepository->find($id);
    }

    public function create(array $data)
    {
        if (empty($data['qr_code'])) {
            $data['qr_code'] = (string) \Illuminate\Support\Str::uuid();
        }
        return $this->TeacherRepository->create($data);
    }

    public function update(string $id, array $data)
    {
        // Add specific business logic here
        return $this->TeacherRepository->update($id, $data);
    }

    public function delete(string $id)
    {
        // Add specific business logic here
        return $this->TeacherRepository->delete($id);
    }
}
