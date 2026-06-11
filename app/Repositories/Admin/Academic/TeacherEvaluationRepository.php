<?php

namespace App\Repositories\Admin\Academic;

use App\Models\TeacherEvaluation;
use App\Repositories\Contracts\Admin\Academic\TeacherEvaluationRepositoryInterface;

class TeacherEvaluationRepository implements TeacherEvaluationRepositoryInterface
{
    public function getAllPaginated(int $perPage = 10, array $filters = [])
    {
        return TeacherEvaluation::with(['teacher', 'evaluator'])->latest()->paginate($perPage)->withQueryString();
    }

    public function create(array $data)
    {
        return TeacherEvaluation::create($data);
    }

    public function findById(string $id)
    {
        return TeacherEvaluation::findOrFail($id);
    }

    public function update(string $id, array $data)
    {
        $record = $this->findById($id);
        $record->update($data);
        return $record;
    }

    public function delete(string $id)
    {
        $record = $this->findById($id);
        return $record->delete();
    }
}
