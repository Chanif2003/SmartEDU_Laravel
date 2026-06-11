<?php

namespace App\Services\Presence;

use App\Models\PresenceSetting;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Staff;
use App\Repositories\Contracts\Presence\PresenceRecordRepositoryInterface;
use Exception;
use Illuminate\Support\Carbon;

class PresenceService
{
    public function __construct(
        protected PresenceRecordRepositoryInterface $presenceRepo
    ) {}

    public function scanQr(string $qrCode)
    {
        $person = $this->findPersonByQr($qrCode);

        if (!$person) {
            throw new Exception("QR Code tidak dikenali atau tidak valid.");
        }

        $now = now();
        $date = $now->toDateString();
        $time = $now->toTimeString();
        $personType = get_class($person);
        $typeString = $person instanceof Student ? 'student' : ($person instanceof Teacher ? 'teacher' : 'staff');

        $setting = PresenceSetting::where('type', $typeString)->first();
        if (!$setting) {
            // Default rules if setting not seeded
            $limitTime = '07:15:00';
            $endTime = '15:00:00';
        } else {
            $limitTime = $setting->limit_time;
            $endTime = $setting->end_time;
        }

        $record = $this->presenceRepo->findByPersonAndDate($person->id, $personType, $date);

        if (!$record) {
            // Check In
            $statusIn = $time > $limitTime ? 'terlambat' : 'tepat';
            $this->presenceRepo->create([
                'person_id' => $person->id,
                'person_type' => $personType,
                'date' => $date,
                'check_in' => $time,
                'status_in' => $statusIn
            ]);

            return [
                'type' => 'check-in',
                'person' => $person,
                'status' => $statusIn,
                'time' => $time
            ];
        } else {
            // Check Out
            // Anti-spam check (if checking out within 5 minutes of check_in)
            $checkInTime = Carbon::parse($record->check_in);
            if ($checkInTime->diffInMinutes($now) < 5) {
                throw new Exception("Anda baru saja melakukan check-in. Harap tunggu beberapa saat untuk check-out.");
            }

            // Already checked out?
            if ($record->check_out !== null && Carbon::parse($record->check_out)->diffInMinutes($now) < 5) {
                throw new Exception("Anda baru saja melakukan check-out. Harap tunggu.");
            }

            $statusOut = $time < $endTime ? 'awal' : 'tepat';
            
            $this->presenceRepo->update($record, [
                'check_out' => $time,
                'status_out' => $statusOut
            ]);

            return [
                'type' => 'check-out',
                'person' => $person,
                'status' => $statusOut,
                'time' => $time
            ];
        }
    }

    protected function findPersonByQr(string $qrCode)
    {
        $student = Student::find($qrCode);
        if ($student) return $student;

        $teacher = Teacher::find($qrCode);
        if ($teacher) return $teacher;

        $staff = Staff::find($qrCode);
        if ($staff) return $staff;

        return null;
    }
}
