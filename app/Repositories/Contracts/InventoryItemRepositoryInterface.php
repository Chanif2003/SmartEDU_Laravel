<?php

namespace App\Repositories\Contracts;

interface InventoryItemRepositoryInterface
{
    public function paginate(int $perPage = 10, array $filters = []);
    public function find(string $id);
    public function create(array $data);
    public function update(string $id, array $data);
    public function delete(string $id);
    public function getStatistics();
}
