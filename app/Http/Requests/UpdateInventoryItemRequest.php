<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateInventoryItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'item_code' => ['required', 'string', 'max:255', 'unique:inventory_items,item_code,' . $this->route('inventory')],
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'max:255'],
            'condition' => ['required', 'in:baik,rusak_ringan,rusak_berat,hilang'],
            'location' => ['nullable', 'string', 'max:255'],
            'quantity' => ['required', 'integer', 'min:1'],
            'notes' => ['nullable', 'string'],
            'last_checked_at' => ['nullable', 'date'],
        ];
    }
}
