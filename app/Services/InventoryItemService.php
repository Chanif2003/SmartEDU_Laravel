<?php

namespace App\Services;

use App\Repositories\Contracts\InventoryItemRepositoryInterface;

class InventoryItemService
{
    protected $inventoryItemRepository;

    public function __construct(InventoryItemRepositoryInterface $inventoryItemRepository)
    {
        $this->inventoryItemRepository = $inventoryItemRepository;
    }

    public function createItem(array $data)
    {
        // Add business logic if necessary, e.g. automatically set last_checked_at on create
        $data['last_checked_at'] = now();
        return $this->inventoryItemRepository->create($data);
    }

    public function updateItem(string $id, array $data)
    {
        // Business logic for update
        $data['last_checked_at'] = now();
        return $this->inventoryItemRepository->update($id, $data);
    }

    public function deleteItem(string $id)
    {
        return $this->inventoryItemRepository->delete($id);
    }
}
