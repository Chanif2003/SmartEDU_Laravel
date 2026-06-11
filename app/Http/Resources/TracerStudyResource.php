<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TracerStudyResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'student_id' => $this->student_id,
            'student_name' => $this->whenLoaded('student', function () {
                return $this->student->nama_lengkap;
            }),
            'graduation_year' => $this->whenLoaded('student', function () {
                return $this->student->graduation_year;
            }),
            'entry_year' => $this->entry_year,
            'status' => $this->status,
            'institution_name' => $this->institution_name,
            'position_or_major' => $this->position_or_major,
            'income_range' => $this->income_range,
            'contact_number' => $this->contact_number,
            'notes' => $this->notes,
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
