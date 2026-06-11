<?php

namespace App\Http\Requests\Admin\Academic;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class TeacherEvaluationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'teacher_id' => ['required', 'uuid', 'exists:teachers,id'],
            'month' => ['required', 'date_format:Y-m'],
            'feedback' => ['required', 'string'],
            'score' => ['required', 'integer', 'min:0', 'max:100'],
        ];
    }
}
