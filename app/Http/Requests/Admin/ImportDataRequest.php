<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ImportDataRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Add role logic if needed
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'file' => [
                'required',
                'file',
                'mimes:xlsx,csv,txt', // csv can be identified as txt
                'max:10240', // 10MB
            ],
            'type' => ['required', 'string', 'in:students,teachers,staffs,subjects,classes'],
            'class_id' => ['nullable', 'uuid', 'exists:school_classes,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'file.required' => 'File Excel/CSV harus diunggah.',
            'file.mimes' => 'Format file harus .xlsx atau .csv.',
            'file.max' => 'Ukuran file tidak boleh lebih dari 10MB.',
            'class_id.exists' => 'Kelas yang dipilih tidak valid.'
        ];
    }
}
