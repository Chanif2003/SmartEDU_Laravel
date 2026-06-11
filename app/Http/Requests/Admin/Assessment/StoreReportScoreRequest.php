<?php

namespace App\Http\Requests\Admin\Assessment;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreReportScoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->user()->role === 'admin' || auth()->user()->role === 'teacher';
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'semester_id' => 'required|exists:semesters,id',
            'subject_id' => 'required|exists:subjects,id',
            'learning_objective_id' => 'required|exists:learning_objectives,id',
            'report_type' => 'required|in:mid_term,final_term',
            'scores' => 'required|array',
            'scores.*.student_id' => 'required|exists:students,id',
            'scores.*.pts_score' => 'nullable|numeric|min:0|max:100',
            'scores.*.pas_score' => 'nullable|numeric|min:0|max:100',
        ];
    }
}
