<?php

namespace App\Http\Requests\Eskul;

use Illuminate\Foundation\Http\FormRequest;

class StoreExtracurricularRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', 'unique:extracurriculars,name'],
            'coach_id' => ['nullable', 'exists:teachers,id'],
        ];
    }
}
