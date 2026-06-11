<?php

namespace App\Repositories\Contracts\Admin\Discipline;

interface ViolationRepositoryInterface
{
    public function getAllPaginated(int $perPage = 10, array $filters = []);
    public function getByStudentId(string $studentId, int $perPage = 10);
    public function getTotalPointsByStudentId(string $studentId);
    public function create(array $data);
    public function findById(string $id);
    public function update(string $id, array $data);
    public function delete(string $id);
}
