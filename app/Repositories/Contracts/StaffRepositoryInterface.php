<?php

namespace App\Repositories\Contracts;

interface StaffRepositoryInterface
{
    public function getPaginated(int $perPage = 10, array $filters = []);
    public function find(string $id);
    public function create(array $data);
    public function update(string $id, array $data);
    public function delete(string $id);
}
