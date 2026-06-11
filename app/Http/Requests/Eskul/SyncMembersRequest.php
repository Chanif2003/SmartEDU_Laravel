<?php

namespace App\Http\Requests\Eskul;

use Illuminate\Foundation\Http\FormRequest;

class SyncMembersRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'student_ids' => ['array'],
            'student_ids.*' => ['exists:students,id'],
        ];
    }
}
