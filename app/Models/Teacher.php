<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Teacher extends Model
{
    use HasUuids;
    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function evaluations()
    {
        return $this->hasMany(TeacherEvaluation::class)->orderBy('month', 'desc');
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }
}
