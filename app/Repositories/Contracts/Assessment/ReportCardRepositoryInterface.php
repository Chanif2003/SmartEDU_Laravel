<?php

namespace App\Repositories\Contracts\Assessment;

interface ReportCardRepositoryInterface
{
    public function getScoresByStudentAndSemester($studentId, $semesterId);
    public function getReportCard($studentId, $semesterId);
    public function storeScores(array $data);
    public function updateReportCard($studentId, $semesterId, array $data);
}
