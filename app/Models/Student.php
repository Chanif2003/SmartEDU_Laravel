<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Student extends Model
{
    use HasUuids, \Illuminate\Database\Eloquent\SoftDeletes;
    protected $guarded = [];
    protected $fillable = [
        'user_id',
        'class_id',
        'major_id',
        'nama_lengkap',
        'nisn',
        'nis',
        'gender',
        'birth_place',
        'birth_date',
        'phone',
        'address',
        'is_active',
        'admission_date',
        'photo_path',
        'applicant_id',
        'is_alumni',
        'graduation_year',
        'graduation_date',
        'skl_number',
        'ijazah_number',
        'ijazah_scan',
        'registration_type',
        'origin_school',
        'entry_date',
        'entry_semester_id',
        'exit_date',
        'exit_reason',
        'notes_buku_induk',
        'tempat_lahir',
        'tanggal_lahir',
        'agama',
        'alamat',
        'no_telepon',
        'nama_ayah',
        'nama_ibu',
        'nama_wali',
        'no_telepon_ortu',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'admission_date' => 'date',
        'graduation_date' => 'date',
        'entry_date' => 'date',
        'exit_date' => 'date',
        'is_alumni' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function major()
    {
        return $this->belongsTo(Major::class, 'major_id');
    }

    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class, 'class_id');
    }

    public function sppPayments()
    {
        return $this->hasMany(SppPayment::class);
    }

    public function applicant()
    {
        return $this->belongsTo(Applicant::class, 'applicant_id');
    }

    public function tracerStudies()
    {
        return $this->hasMany(TracerStudy::class);
    }

    public function reportCards()
    {
        return $this->hasMany(StudentReportCard::class);
    }

    public function violations()
    {
        return $this->hasMany(Violation::class);
    }

    public function reportCardScores()
    {
        return $this->hasMany(ReportCardScore::class);
    }
}
