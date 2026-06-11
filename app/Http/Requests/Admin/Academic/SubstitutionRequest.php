<?php

namespace App\Http\Requests\Admin\Academic;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class SubstitutionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'date' => ['required', 'date', 'before_or_equal:today'],
            'schedule_id' => ['required', 'uuid', 'exists:schedules,id'],
            'substitute_teacher_id' => ['required', 'uuid', 'exists:teachers,id'],
            'absence_reason' => ['required', 'string', 'max:255'],
            'topic' => ['required', 'string', 'max:255'],
            'records' => ['nullable', 'array'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
