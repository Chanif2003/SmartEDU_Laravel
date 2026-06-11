<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApplicantResource extends JsonResource
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
            'registration_number' => $this->registration_number,
            'full_name' => $this->full_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'birth_date' => $this->birth_date?->format('Y-m-d'),
            'address' => $this->address,
            'status' => $this->status,
            'major' => $this->whenLoaded('major', function () {
                return [
                    'id' => $this->major->id,
                    'name' => $this->major->name,
                ];
            }),
            'documents_path' => $this->documents_path,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
