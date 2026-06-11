<?php

namespace App\Services\Assessment;

use App\Repositories\Contracts\Assessment\ReportCardRepositoryInterface;
use App\Models\Attendance;
use App\Models\PresenceRecord;

class ReportCardService
{
    protected $reportCardRepository;

    public function __construct(ReportCardRepositoryInterface $reportCardRepository)
    {
        $this->reportCardRepository = $reportCardRepository;
    }

    /**
     * Calculate total absences (sakit, izin, alpa) and aggregate scores,
     * then save into student_report_cards.
     */
    public function generateReportCard($studentId, $semesterId)
    {
        // 1. Calculate Attendance
        // The attendances table stores records as a JSON: {"student_id": "status"}
        $sick = Attendance::whereHas('schedule', function($q) use ($semesterId) {
                $q->where('semester_id', $semesterId);
            })
            ->where('records->' . $studentId, 'sick')
            ->count();
            
        $permission = Attendance::whereHas('schedule', function($q) use ($semesterId) {
                $q->where('semester_id', $semesterId);
            })
            ->where('records->' . $studentId, 'permission')
            ->count();
            
        $absent = Attendance::whereHas('schedule', function($q) use ($semesterId) {
                $q->where('semester_id', $semesterId);
            })
            ->where('records->' . $studentId, 'absent')
            ->count();

        $totalSick = $sick;
        $totalPermission = $permission;
        $totalAbsent = $absent;

        // 2. We can aggregate scores if we want to store final grades, 
        // but report_card_scores table holds the raw data per subject/LO.
        // We just update the report card metadata.

        $data = [
            'sick_days' => $totalSick,
            'permission_days' => $totalPermission,
            'absent_days' => $totalAbsent,
            'status' => 'draft',
            // retain existing notes if any
        ];

        return $this->reportCardRepository->updateReportCard($studentId, $semesterId, $data);
    }
}
