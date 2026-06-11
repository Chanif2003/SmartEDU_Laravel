<?php

namespace App\Http\Requests\Admin\Academic;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class TeacherAdministrationRequest extends FormRequest
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
            'teacher_id' => ['nullable', 'uuid', 'exists:teachers,id'],
            'semester_id' => ['required', 'uuid', 'exists:semesters,id'],
            'subject_id' => ['required', 'uuid', 'exists:subjects,id'],
            'prota_file' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'promes_file' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'cp_file' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'atp_file' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'modul_file' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'kktp_file' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'lkpd_file' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
            'rubrik_file' => ['nullable', 'file', 'mimes:pdf,doc,docx', 'max:10240'],
        ];
    }
}
