<?php

namespace App\Repositories\Contracts;

interface TeacherRepositoryInterface
{
    public function paginate(int $perPage, array $filters = []);
    public function find(string $id);
    public function create(array $data);
    public function update(string $id, array $data);
    public function delete(string $id);
}
