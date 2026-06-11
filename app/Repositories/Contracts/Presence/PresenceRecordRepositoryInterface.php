<?php

namespace App\Repositories\Contracts\Presence;

use App\Models\PresenceRecord;
use Illuminate\Database\Eloquent\Collection;

interface PresenceRecordRepositoryInterface
{
    public function findByPersonAndDate(string $personId, string $personType, string $date): ?PresenceRecord;
    public function create(array $data): PresenceRecord;
    public function update(PresenceRecord $record, array $data): bool;
    public function getTodayRecords(): Collection;
}
