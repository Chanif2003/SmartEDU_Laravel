<?php

namespace App\Services;

use App\Repositories\Contracts\ApplicantRepositoryInterface;
use App\Models\Student;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ApplicantService
{
    protected $applicantRepository;

    public function __construct(ApplicantRepositoryInterface $applicantRepository)
    {
        $this->applicantRepository = $applicantRepository;
    }

    public function registerApplicant(array $data, $kkFile, $ijazahFile)
    {
        // Handle file uploads
        $documents = [];
        if ($kkFile) {
            $path = $kkFile->store('public/documents');
            $documents['kk'] = str_replace('public/', 'storage/', $path);
        }
        if ($ijazahFile) {
            $path = $ijazahFile->store('public/documents');
            $documents['ijazah'] = str_replace('public/', 'storage/', $path);
        }

        $data['documents_path'] = $documents;
        
        // Generate Registration Number
        $year = date('Y');
        $count = DB::table('applicants')->whereYear('created_at', $year)->count() + 1;
        $data['registration_number'] = "REG-{$year}-" . str_pad($count, 4, '0', STR_PAD_LEFT);

        return $this->applicantRepository->create($data);
    }

    public function approveApplicant(string $id)
    {
        return DB::transaction(function () use ($id) {
            $applicant = $this->applicantRepository->find($id);
            
            if ($applicant->status === 'accepted') {
                throw new \Exception('Pelamar ini sudah disetujui sebelumnya.');
            }

            $applicant->status = 'accepted';
            $applicant->save();

            // Generate NISN and NIS
            $year = date('Y');
            $count = Student::whereYear('created_at', $year)->count() + 1;
            $nisn = "00" . str_pad($count, 6, '0', STR_PAD_LEFT);
            $nis = date('ym') . str_pad($count, 4, '0', STR_PAD_LEFT);

            // Create Student
            $student = Student::create([
                'nama_lengkap' => $applicant->full_name,
                'nisn' => $nisn,
                'nis' => $nis,
                'gender' => 'L', // Default or parse from somewhere
                'applicant_id' => $applicant->id,
                'is_active' => true,
            ]);

            return $student;
        });
    }

    public function rejectApplicant(string $id)
    {
        $applicant = $this->applicantRepository->find($id);
        $applicant->status = 'rejected';
        $applicant->save();

        return $applicant;
    }
}
