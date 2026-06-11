<?php

namespace App\Services\Admin\Academic;

use App\Repositories\Contracts\Admin\Academic\TeacherEvaluationRepositoryInterface;
use App\Models\Schedule;
use App\Models\Attendance;
use App\Models\Journal;
use App\Models\Assessment;
use App\Models\TeacherAdministration;
use App\Models\TeacherEvaluation;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class TeacherEvaluationService
{
    protected $repository;

    public function __construct(TeacherEvaluationRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function getAll(int $perPage = 10, array $filters = [])
    {
        return $this->repository->getAllPaginated($perPage, $filters);
    }

    public function create(array $data)
    {
        try {
            return $this->repository->create($data);
        } catch (\Exception $e) {
            Log::error('Error creating TeacherEvaluation: ' . $e->getMessage());
            throw $e;
        }
    }

    public function update(string $id, array $data)
    {
        try {
            return $this->repository->update($id, $data);
        } catch (\Exception $e) {
            Log::error('Error updating TeacherEvaluation: ' . $e->getMessage());
            throw $e;
        }
    }

    public function delete(string $id)
    {
        try {
            return $this->repository->delete($id);
        } catch (\Exception $e) {
            Log::error('Error deleting TeacherEvaluation: ' . $e->getMessage());
            throw $e;
        }
    }

    public function generateKPI(string $teacherId, string $month, string $evaluatorId)
    {
        try {
            $date = Carbon::createFromFormat('Y-m', $month);
            $year = $date->year;
            $monthNum = $date->month;
            $daysInMonth = $date->daysInMonth;

            // Mapping Indonesian days to Carbon days
            $dayMap = [
                'Minggu' => Carbon::SUNDAY,
                'Senin' => Carbon::MONDAY,
                'Selasa' => Carbon::TUESDAY,
                'Rabu' => Carbon::WEDNESDAY,
                'Kamis' => Carbon::THURSDAY,
                'Jumat' => Carbon::FRIDAY,
                'Sabtu' => Carbon::SATURDAY,
            ];

            // 1. Get Schedules
            $schedules = Schedule::where('teacher_id', $teacherId)->get();
            
            $expectedClasses = 0;
            $scheduleDayCounts = [];

            foreach ($schedules as $schedule) {
                $dayOfWeek = $dayMap[$schedule->day] ?? null;
                if ($dayOfWeek !== null) {
                    $occurrences = 0;
                    for ($d = 1; $d <= $daysInMonth; $d++) {
                        if (Carbon::create($year, $monthNum, $d)->dayOfWeek === $dayOfWeek) {
                            $occurrences++;
                        }
                    }
                    $expectedClasses += $occurrences;
                    if (!isset($scheduleDayCounts[$schedule->id])) {
                        $scheduleDayCounts[$schedule->id] = 0;
                    }
                    $scheduleDayCounts[$schedule->id] += $occurrences;
                }
            }

            // 2. Attendance & Journal
            // Using actual entries vs expected
            $attendanceCount = Attendance::where('teacher_id', $teacherId)
                ->whereYear('date', $year)
                ->whereMonth('date', $monthNum)
                ->count();
            
            $journalCount = Journal::where('teacher_id', $teacherId)
                ->whereYear('date', $year)
                ->whereMonth('date', $monthNum)
                ->count();

            $attendanceScore = $expectedClasses > 0 ? min(($attendanceCount / $expectedClasses) * 100, 100) : 100;
            $journalScore = $expectedClasses > 0 ? min(($journalCount / $expectedClasses) * 100, 100) : 100;

            // 3. Assessment
            // Did they assess each class they teach this month?
            $classesTaught = $schedules->pluck('class_id')->unique();
            $expectedAssessments = $classesTaught->count();
            
            $actualAssessments = Assessment::where('teacher_id', $teacherId)
                ->whereYear('date', $year)
                ->whereMonth('date', $monthNum)
                ->select('class_id')
                ->distinct()
                ->count();

            $assessmentScore = $expectedAssessments > 0 ? min(($actualAssessments / $expectedAssessments) * 100, 100) : 100;

            // 4. Administration
            // Find administration for current teacher
            $admins = TeacherAdministration::where('teacher_id', $teacherId)->get();
            $adminScore = 0;
            if ($admins->count() > 0) {
                $totalFields = 6; // prota, promes, modul, kktp, lkpd, rubrik
                $totalFilled = 0;
                foreach ($admins as $admin) {
                    $filled = 0;
                    if ($admin->prota_path) $filled++;
                    if ($admin->promes_path) $filled++;
                    if ($admin->modul_path) $filled++;
                    if ($admin->kktp_path) $filled++;
                    if ($admin->lkpd_path) $filled++;
                    if ($admin->rubrik_path) $filled++;
                    
                    $totalFilled += ($filled / $totalFields) * 100;
                }
                $adminScore = $totalFilled / $admins->count();
            }

            // Calculate final score
            $finalScore = ($attendanceScore + $journalScore + $assessmentScore + $adminScore) / 4;

            // Generate Feedback
            $feedback = "Evaluasi Otomatis $month.\n";
            $lowestScore = min($attendanceScore, $journalScore, $assessmentScore, $adminScore);
            if ($lowestScore == $adminScore && $adminScore < 80) {
                $feedback .= "Perhatian: Kelengkapan administrasi Anda masih kurang. Mohon segera melengkapi perangkat pembelajaran.";
            } elseif ($lowestScore == $journalScore && $journalScore < 80) {
                $feedback .= "Perhatian: Anda sering lupa mengisi jurnal mengajar. Mohon disiplin dalam pengisian jurnal.";
            } elseif ($lowestScore == $attendanceScore && $attendanceScore < 80) {
                $feedback .= "Perhatian: Tingkat pengisian absensi kelas Anda rendah.";
            } elseif ($lowestScore == $assessmentScore && $assessmentScore < 80) {
                $feedback .= "Perhatian: Anda belum memberikan penilaian harian secara rutin di kelas.";
            } else {
                $feedback .= "Kinerja Anda secara keseluruhan sangat baik. Teruskan pekerjaan yang bagus!";
            }

            $metrics = [
                'attendance_score' => round($attendanceScore, 2),
                'journal_score' => round($journalScore, 2),
                'assessment_score' => round($assessmentScore, 2),
                'administration_score' => round($adminScore, 2)
            ];

            // Create or update evaluation
            $evaluation = TeacherEvaluation::updateOrCreate(
                ['teacher_id' => $teacherId, 'month' => $month],
                [
                    'evaluator_id' => $evaluatorId,
                    'feedback' => $feedback,
                    'score' => round($finalScore, 2),
                    'metrics' => $metrics
                ]
            );

            return $evaluation;
        } catch (\Exception $e) {
            Log::error('Error generating KPI: ' . $e->getMessage());
            throw $e;
        }
    }
}
