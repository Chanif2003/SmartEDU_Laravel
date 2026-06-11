<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TeacherAdministration extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'semester_id', 'teacher_id', 'subject_id', 
        'prota_path', 'promes_path', 'cp_path', 'atp_path', 'modul_path',
        'kktp_path', 'lkpd_path', 'rubrik_path'
    ];

    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class);
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }
}
