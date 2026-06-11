<?php

namespace App\Repositories\Contracts;

interface TracerStudyRepositoryInterface
{
    public function paginate(int $perPage = 10, array $filters = []);
    public function getStatistics(array $filters = []);
    public function getYearlyStatistics();
    public function findByStudentAndYear(string $studentId, int $year);
    public function updateOrCreate(array $attributes, array $values);
}
