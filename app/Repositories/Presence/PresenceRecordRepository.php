<?php

namespace App\Repositories\Presence;

use App\Models\PresenceRecord;
use App\Repositories\Contracts\Presence\PresenceRecordRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;

class PresenceRecordRepository implements PresenceRecordRepositoryInterface
{
    public function findByPersonAndDate(string $personId, string $personType, string $date): ?PresenceRecord
    {
        return PresenceRecord::where('person_id', $personId)
            ->where('person_type', $personType)
            ->where('date', $date)
            ->first();
    }

    public function create(array $data): PresenceRecord
    {
        return PresenceRecord::create($data);
    }

    public function update(PresenceRecord $record, array $data): bool
    {
        return $record->update($data);
    }

    public function getTodayRecords(): Collection
    {
        return PresenceRecord::with('person')
            ->where('date', now()->toDateString())
            ->orderBy('created_at', 'desc')
            ->get();
    }
}
