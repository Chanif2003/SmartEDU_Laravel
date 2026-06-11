<?php

namespace App\Repositories;

use App\Models\InventoryItem;
use App\Repositories\Contracts\InventoryItemRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;

class InventoryItemRepository implements InventoryItemRepositoryInterface
{
    public function paginate(int $perPage = 10, array $filters = [])
    {
        $query = InventoryItem::query();

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function (Builder $q) use ($search) {
                $q->where('item_code', 'like', "%{$search}%")
                  ->orWhere('name', 'like', "%{$search}%");
            });
        }

        if (!empty($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        if (!empty($filters['condition'])) {
            $query->where('condition', $filters['condition']);
        }

        return $query->latest()->paginate($perPage);
    }

    public function find(string $id)
    {
        return InventoryItem::findOrFail($id);
    }

    public function create(array $data)
    {
        return InventoryItem::create($data);
    }

    public function update(string $id, array $data)
    {
        $item = $this->find($id);
        $item->update($data);
        return $item;
    }

    public function getStatistics()
    {
        $conditionCounts = \App\Models\InventoryItem::selectRaw('`condition`, count(*) as count')->groupBy('condition')->pluck('count', 'condition')->toArray();
        $categoryCounts = \App\Models\InventoryItem::selectRaw('category, count(*) as count')->groupBy('category')->pluck('count', 'category')->toArray();

        return [
            'condition_distribution' => [
                ['name' => 'Baik', 'value' => $conditionCounts['baik'] ?? 0],
                ['name' => 'Rusak Ringan', 'value' => $conditionCounts['rusak_ringan'] ?? 0],
                ['name' => 'Rusak Berat', 'value' => $conditionCounts['rusak_berat'] ?? 0],
            ],
            'category_distribution' => array_map(function ($k, $v) { return ['name' => ucfirst(str_replace('_', ' ', $k)), 'value' => $v]; }, array_keys($categoryCounts), array_values($categoryCounts))
        ];
    }

    public function delete(string $id)
    {
        $item = $this->find($id);
        return $item->delete();
    }
}
