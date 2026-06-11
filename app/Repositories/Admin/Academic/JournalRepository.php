<?php

namespace App\Repositories\Admin\Academic;

use App\Models\Journal;
use App\Repositories\Contracts\Admin\Academic\JournalRepositoryInterface;

class JournalRepository implements JournalRepositoryInterface
{
    public function getAllPaginated(int $perPage = 10, array $filters = [])
    {
        $query = Journal::with(['schedule', 'schoolClass', 'subject', 'teacher.user'])->latest();
        
        if (!empty($filters['search'])) {
            $query->where(function($q) use ($filters) {
                $q->where('topic', 'like', '%' . $filters['search'] . '%')
                  ->orWhereHas('teacher.user', function($q) use ($filters) {
                      $q->where('name', 'like', '%' . $filters['search'] . '%');
                  });
            });
        }

        if (!empty($filters['teacher_id'])) {
            $query->where('teacher_id', $filters['teacher_id']);
        }

        return $query->paginate($perPage)->withQueryString();
    }

    public function create(array $data)
    {
        return Journal::create($data);
    }

    public function findById(string $id)
    {
        return Journal::findOrFail($id);
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
