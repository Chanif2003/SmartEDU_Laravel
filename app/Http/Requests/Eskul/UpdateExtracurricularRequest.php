<?php

namespace App\Http\Requests\Eskul;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateExtracurricularRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('extracurriculars')->ignore($this->extracurricular)],
            'coach_id' => ['nullable', 'exists:teachers,id'],
        ];
    }
}
