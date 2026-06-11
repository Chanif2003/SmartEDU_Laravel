<?php

namespace App\Http\Requests\Admin\Discipline;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ViolationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Dihandle oleh middleware/Policy
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'date' => ['required', 'date'],
            'student_id' => ['required', 'uuid', 'exists:students,id'],
            'violation_type' => ['required', 'in:ringan,sedang,berat'],
            'category' => ['nullable', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'action_taken' => ['nullable', 'string'],
            'points' => ['required', 'integer', 'min:0'],
        ];
    }
}
