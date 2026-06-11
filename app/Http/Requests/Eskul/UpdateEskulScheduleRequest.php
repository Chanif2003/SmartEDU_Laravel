<?php

namespace App\Http\Requests\Eskul;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEskulScheduleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'semester_id' => ['required', 'exists:semesters,id'],
            'extracurricular_id' => ['required', 'exists:extracurriculars,id'],
            'day' => ['required', 'in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu,Minggu'],
            'start_time' => ['nullable', 'date_format:H:i'],
            'end_time' => ['nullable', 'date_format:H:i', 'after:start_time'],
            'location' => ['nullable', 'string', 'max:255'],
        ];
    }
}
