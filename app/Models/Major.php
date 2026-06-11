<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

class Major extends Model
{
    use HasUuids, SoftDeletes;

    protected $guarded = [];

    public function applicants()
    {
        return $this->hasMany(Applicant::class);
    }

    public function students()
    {
        return $this->hasMany(Student::class, 'major_id');
    }
}
