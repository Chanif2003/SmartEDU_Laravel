<?php

namespace App\Repositories\Contracts\Admin;

interface BukuIndukRepositoryInterface
{
    /**
     * Get paginated students for Buku Induk index.
     *
     * @param int $perPage
     * @param array $filters
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */
    public function getPaginated(int $perPage = 15, array $filters = []);

    /**
     * Get a student by ID with all related data needed for Buku Induk.
     *
     * @param string $id
     * @return \App\Models\Student
     */
    public function getStudentDetail(string $id);
}
