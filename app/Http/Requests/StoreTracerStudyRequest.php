<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTracerStudyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Public but verified by student_id in controller or service
    }

    public function rules(): array
    {
        return [
            'student_id' => ['required', 'uuid', 'exists:students,id'],
            'status' => ['required', 'in:working,studying,entrepreneur,seeking,other'],
            'institution_name' => ['required_if:status,working,studying,entrepreneur', 'nullable', 'string', 'max:255'],
            'position_or_major' => ['required_if:status,working,studying', 'nullable', 'string', 'max:255'],
            'income_range' => ['nullable', 'string', 'max:255'],
            'contact_number' => ['nullable', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
