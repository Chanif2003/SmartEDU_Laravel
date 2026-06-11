<?php

namespace App\Repositories\Assessment;

use App\Models\ReportCardScore;
use App\Models\StudentReportCard;
use App\Repositories\Contracts\Assessment\ReportCardRepositoryInterface;

class ReportCardRepository implements ReportCardRepositoryInterface
{
    public function getScoresByStudentAndSemester($studentId, $semesterId)
    {
        return ReportCardScore::with(['subject', 'learningObjective'])
            ->where('student_id', $studentId)
            ->where('semester_id', $semesterId)
            ->get();
    }

    public function getReportCard($studentId, $semesterId)
    {
        return StudentReportCard::where('student_id', $studentId)
            ->where('semester_id', $semesterId)
            ->first();
    }

    public function storeScores(array $data)
    {
        // $data contains array of scores to be upserted
        // It is better to use upsert or iterate
        foreach ($data['scores'] as $score) {
            ReportCardScore::updateOrCreate(
                [
                    'semester_id' => $data['semester_id'],
                    'student_id' => $score['student_id'],
                    'subject_id' => $data['subject_id'],
                    'learning_objective_id' => $data['learning_objective_id'],
                ],
                [
                    'report_type' => $data['report_type'],
                    'pts_score' => $score['pts_score'] ?? null,
                    'pas_score' => $score['pas_score'] ?? null,
                ]
            );
        }

        return true;
    }

    public function updateReportCard($studentId, $semesterId, array $data)
    {
        return StudentReportCard::updateOrCreate(
            [
                'student_id' => $studentId,
                'semester_id' => $semesterId,
            ],
            $data
        );
    }
}
