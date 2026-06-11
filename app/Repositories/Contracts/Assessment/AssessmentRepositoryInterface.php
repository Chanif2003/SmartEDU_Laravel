<?php

namespace App\Repositories\Contracts\Assessment;

interface AssessmentRepositoryInterface
{
    public function getPaginatedByTeacher($teacherId, $perPage = 10);
    public function getLearningObjectives($filters);
    public function storeLearningObjective(array $data);
    public function deleteLearningObjective($id);
    
    public function getAssessments($filters);
    public function storeAssessment(array $data);
}
