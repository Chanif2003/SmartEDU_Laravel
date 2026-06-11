<?php

namespace App\Repositories\Eskul;

use App\Models\Extracurricular;

class ExtracurricularRepository
{
    public function getAll()
    {
        return Extracurricular::with('coach')->get();
    }

    public function findById($id)
    {
        return Extracurricular::with('coach')->findOrFail($id);
    }

    public function create(array $data)
    {
        return Extracurricular::create($data);
    }

    public function update($id, array $data)
    {
        $extracurricular = $this->findById($id);
        $extracurricular->update($data);
        return $extracurricular;
    }

    public function delete($id)
    {
        $extracurricular = $this->findById($id);
        return $extracurricular->delete();
    }

    public function syncMembers($id, array $studentIds)
    {
        $extracurricular = $this->findById($id);
        $extracurricular->students()->sync($studentIds);
        return $extracurricular;
    }

    public function getStatistics()
    {
        $eskuls = \App\Models\Extracurricular::withCount('students')->get();
        $members = [];
        foreach ($eskuls as $e) {
            $members[] = ['name' => $e->name, 'value' => $e->students_count];
        }

        return [
            'member_distribution' => $members
        ];
    }
}