<?php

namespace App\Repositories\Assessment;

use App\Models\Assessment;
use App\Models\LearningObjective;
use App\Repositories\Contracts\Assessment\AssessmentRepositoryInterface;

class AssessmentRepository implements AssessmentRepositoryInterface
{
    public function getPaginatedByTeacher($teacherId, $perPage = 10)
    {
        return Assessment::with(['schoolClass', 'subject'])
            ->where('teacher_id', $teacherId)
            ->latest('date')
            ->paginate($perPage);
    }

    public function getLearningObjectives($filters)
    {
        $query = LearningObjective::with(['schoolClass', 'subject']);
        
        if (isset($filters['teacher_id'])) {
            $query->where('teacher_id', $filters['teacher_id']);
        }

        if (isset($filters['semester_id'])) {
            $query->where('semester_id', $filters['semester_id']);
        }

        if (isset($filters['subject_id'])) {
            $query->where('subject_id', $filters['subject_id']);
        }

        if (isset($filters['class_id'])) {
            $query->where('class_id', $filters['class_id']);
        }

        return $query->get();
    }

    public function storeLearningObjective(array $data)
    {
        return LearningObjective::create($data);
    }

    public function deleteLearningObjective($id)
    {
        $lo = LearningObjective::findOrFail($id);
        return $lo->delete();
    }

    public function getAssessments($filters)
    {
        $query = Assessment::with(['schoolClass', 'subject']);
        
        if (isset($filters['teacher_id'])) {
            $query->where('teacher_id', $filters['teacher_id']);
        }
        if (isset($filters['subject_id'])) {
            $query->where('subject_id', $filters['subject_id']);
        }
        if (isset($filters['class_id'])) {
            $query->where('class_id', $filters['class_id']);
        }

        return $query->get();
    }

    public function storeAssessment(array $data)
    {
        return Assessment::create($data);
    }
}
