<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class VerifyTracerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Public access
    }

    public function rules(): array
    {
        return [
            'identity_number' => ['required', 'string'],
            'birth_date' => ['required', 'date'],
        ];
    }

    public function messages(): array
    {
        return [
            'identity_number.required' => 'Nomor Identitas (NIS/NISN/SKL/Ijazah) wajib diisi.',
            'birth_date.required' => 'Tanggal lahir wajib diisi.',
            'birth_date.date' => 'Format tanggal lahir tidak valid.',
        ];
    }
}
