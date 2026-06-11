<?php

namespace App\Services;

use App\Models\SppPayment;
use App\Models\Attendance;
use App\Models\Violation;
use App\Models\TeacherEvaluation;
use Illuminate\Support\Facades\DB;

class ReportService
{
    /**
     * Get aggregated finance summary
     */
    public function getFinanceSummary($startDate, $endDate)
    {
        return SppPayment::selectRaw('billing_month, sum(amount) as total_income, count(DISTINCT student_id) as total_students')
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->where('status', 'paid')
            ->groupBy('billing_month')
            ->orderBy('billing_month', 'asc')
            ->get();
    }

    /**
     * Get violations statistics
     */
    public function getViolationsStats($startDate, $endDate)
    {
        $byType = Violation::selectRaw('violation_type, count(*) as total')
            ->whereBetween('date', [$startDate, $endDate])
            ->groupBy('violation_type')
            ->get();

        $trend = Violation::selectRaw('DATE(date) as date, count(*) as total')
            ->whereBetween('date', [$startDate, $endDate])
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        return [
            'byType' => $byType,
            'trend' => $trend,
        ];
    }

    /**
     * Get attendance summary
     */
    public function getAttendanceSummary($startDate, $endDate)
    {
        $attendances = Attendance::whereBetween('date', [$startDate, $endDate])->pluck('records');
        $summary = [
            'Hadir' => 0,
            'Sakit' => 0,
            'Izin' => 0,
            'Alpha' => 0,
            'Terlambat' => 0,
        ];

        foreach ($attendances as $records) {
            $recordsArray = is_string($records) ? json_decode($records, true) : $records;
            if (is_array($recordsArray)) {
                foreach ($recordsArray as $record) {
                    $status = is_array($record) ? ($record['status'] ?? 'Unknown') : (is_string($record) ? $record : 'Unknown');
                    if (isset($summary[$status])) {
                        $summary[$status]++;
                    } else {
                        $summary[$status] = 1;
                    }
                }
            }
        }

        // Format for recharts
        $chartData = [];
        foreach ($summary as $name => $value) {
            $chartData[] = [
                'name' => $name,
                'value' => $value
            ];
        }

        return $chartData;
    }

    /**
     * Get Teacher Evaluation / KPI Stats
     */
    public function getTeacherKpiStats($startDate, $endDate)
    {
        $startMonth = substr($startDate, 0, 7);
        $endMonth = substr($endDate, 0, 7);

        $trend = TeacherEvaluation::selectRaw('month, avg(score) as average_score, count(*) as total_evaluations')
            ->whereBetween('month', [$startMonth, $endMonth])
            ->groupBy('month')
            ->orderBy('month', 'asc')
            ->get();

        $distribution = TeacherEvaluation::selectRaw('
            SUM(CASE WHEN score >= 90 THEN 1 ELSE 0 END) as excellent,
            SUM(CASE WHEN score >= 75 AND score < 90 THEN 1 ELSE 0 END) as good,
            SUM(CASE WHEN score >= 60 AND score < 75 THEN 1 ELSE 0 END) as fair,
            SUM(CASE WHEN score < 60 THEN 1 ELSE 0 END) as poor
        ')
        ->whereBetween('month', [$startMonth, $endMonth])
        ->first();

        // Top 5 Teachers
        $topTeachers = TeacherEvaluation::with('teacher:id,nama_lengkap')
            ->selectRaw('teacher_id, avg(score) as average_score')
            ->whereBetween('month', [$startMonth, $endMonth])
            ->groupBy('teacher_id')
            ->orderBy('average_score', 'desc')
            ->limit(5)
            ->get();

        return [
            'trend' => $trend,
            'distribution' => [
                ['name' => 'Sangat Baik (≥90)', 'value' => (int) $distribution->excellent],
                ['name' => 'Baik (75-89)', 'value' => (int) $distribution->good],
                ['name' => 'Cukup (60-74)', 'value' => (int) $distribution->fair],
                ['name' => 'Kurang (<60)', 'value' => (int) $distribution->poor],
            ],
            'topTeachers' => $topTeachers,
        ];
    }
}
