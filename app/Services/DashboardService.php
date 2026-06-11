<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\Contracts\DashboardRepositoryInterface;

class DashboardService
{
    protected DashboardRepositoryInterface $dashboardRepository;

    public function __construct(DashboardRepositoryInterface $dashboardRepository)
    {
        $this->dashboardRepository = $dashboardRepository;
    }

    public function getDashboardMetrics(User $user): array
    {
        $dayNameEn = now()->format('l');
        $dayMap = [
            'Sunday' => 'Minggu',
            'Monday' => 'Senin',
            'Tuesday' => 'Selasa',
            'Wednesday' => 'Rabu',
            'Thursday' => 'Kamis',
            'Friday' => 'Jumat',
            'Saturday' => 'Sabtu',
        ];
        $dayName = $dayMap[$dayNameEn];

        if ($user->role === 'admin') {
            return [
                'role' => 'admin',
                'metrics' => $this->dashboardRepository->getAdminMetrics(),
            ];
        }

        if ($user->role === 'teacher') {
            $teacherId = $user->teacherProfile?->id;
            
            return [
                'role' => 'teacher',
                'metrics' => $teacherId 
                    ? $this->dashboardRepository->getTeacherMetrics($teacherId, $dayName) 
                    : ['today_schedules' => [], 'pending_journals' => 0],
            ];
        }

        if ($user->role === 'student') {
            $studentId = $user->studentProfile?->id;
            
            return [
                'role' => 'student',
                'metrics' => $studentId
                    ? $this->dashboardRepository->getStudentMetrics($studentId, $dayName)
                    : ['today_schedules' => [], 'latest_attendance' => 'none', 'violation_points' => 0, 'spp_status' => 'paid'],
            ];
        }

        return [
            'role' => 'guest',
            'metrics' => []
        ];
    }
}
