<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InventoryItemResource extends JsonResource
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
            'item_code' => $this->item_code,
            'name' => $this->name,
            'category' => $this->category,
            'condition' => $this->condition,
            'location' => $this->location,
            'quantity' => $this->quantity,
            'notes' => $this->notes,
            'last_checked_at' => $this->last_checked_at ? $this->last_checked_at->format('Y-m-d') : null,
            'created_at' => $this->created_at->toIso8601String(),
            'updated_at' => $this->updated_at->toIso8601String(),
        ];
    }
}
