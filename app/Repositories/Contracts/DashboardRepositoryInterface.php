<?php

namespace App\Repositories\Contracts;

interface DashboardRepositoryInterface
{
    public function getAdminMetrics(): array;
    public function getTeacherMetrics(string $teacherId, string $day): array;
    public function getStudentMetrics(string $studentId, string $day): array;
}
