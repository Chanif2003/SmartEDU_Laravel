<?php

namespace App\Repositories\Contracts;

interface ApplicantRepositoryInterface
{
    public function paginate(int $perPage, array $filters = []);
    public function find(string $id);
    public function create(array $data);
    public function update(string $id, array $data);
    public function delete(string $id);
    public function getPendingCount();
    public function getStatistics();
}
