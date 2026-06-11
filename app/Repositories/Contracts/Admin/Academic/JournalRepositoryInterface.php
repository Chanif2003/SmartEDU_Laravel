<?php

namespace App\Repositories\Contracts\Admin\Academic;

interface JournalRepositoryInterface
{
    public function getAllPaginated(int $perPage = 10, array $filters = []);
    public function create(array $data);
    public function findById(string $id);
    public function update(string $id, array $data);
    public function delete(string $id);
}
