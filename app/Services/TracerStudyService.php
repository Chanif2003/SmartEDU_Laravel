<?php

namespace App\Services;

use App\Models\Student;
use App\Repositories\Contracts\TracerStudyRepositoryInterface;
use Exception;

class TracerStudyService
{
    protected $tracerStudyRepository;

    public function __construct(TracerStudyRepositoryInterface $tracerStudyRepository)
    {
        $this->tracerStudyRepository = $tracerStudyRepository;
    }

    public function verifyStudent(string $identityNumber, string $birthDate)
    {
        $student = Student::where(function ($query) use ($identityNumber) {
                $query->where('nis', $identityNumber)
                      ->orWhere('nisn', $identityNumber)
                      ->orWhere('skl_number', $identityNumber)
                      ->orWhere('ijazah_number', $identityNumber);
            })
            ->where('birth_date', $birthDate)
            ->where('is_alumni', true)
            ->first();

        if (!$student) {
            throw new Exception('Data alumni tidak ditemukan atau tidak cocok dengan sistem.');
        }

        return $student;
    }

    public function submitTracerStudy(array $data)
    {
        $currentYear = date('Y');
        
        $attributes = [
            'student_id' => $data['student_id'],
            'entry_year' => $currentYear,
        ];

        // This allows alumni to update their data for the current year if they made a mistake, 
        // without overwriting data from previous years.
        return $this->tracerStudyRepository->updateOrCreate($attributes, $data);
    }
}
