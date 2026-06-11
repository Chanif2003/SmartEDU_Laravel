<?php

namespace App\Http\Requests\Admin\Academic;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class JournalRequest extends FormRequest
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
            'class_id' => ['required', 'uuid', 'exists:school_classes,id'],
            'subject_id' => ['required', 'uuid', 'exists:subjects,id'],
            'session_number' => ['required', 'integer', 'min:1'],
            'topic' => ['required', 'string', 'max:255'],
            'time_context' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
