<?php

namespace App\Http\Controllers\Admin\Sarpras;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreInventoryItemRequest;
use App\Http\Requests\UpdateInventoryItemRequest;
use App\Http\Resources\InventoryItemResource;
use App\Repositories\Contracts\InventoryItemRepositoryInterface;
use App\Services\InventoryItemService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryItemController extends Controller
{
    protected $inventoryItemRepository;
    protected $inventoryItemService;

    public function __construct(
        InventoryItemRepositoryInterface $inventoryItemRepository,
        InventoryItemService $inventoryItemService
    ) {
        $this->inventoryItemRepository = $inventoryItemRepository;
        $this->inventoryItemService = $inventoryItemService;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'category', 'condition']);
        $items = $this->inventoryItemRepository->paginate(10, $filters);

        return Inertia::render('Admin/Sarpras/Index', [
            'inventoryItems' => InventoryItemResource::collection($items),
            'filters' => $filters,
            'statistics' => $this->inventoryItemRepository->getStatistics(),
        ]);
    }

    public function store(StoreInventoryItemRequest $request)
    {
        try {
            $this->inventoryItemService->createItem($request->validated());
            return back()->with('success', 'Data barang berhasil ditambahkan.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal menyimpan data: ' . $e->getMessage()]);
        }
    }

    public function update(UpdateInventoryItemRequest $request, string $id)
    {
        try {
            $this->inventoryItemService->updateItem($id, $request->validated());
            return back()->with('success', 'Data barang berhasil diperbarui.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal memperbarui data: ' . $e->getMessage()]);
        }
    }

    public function destroy(string $id)
    {
        try {
            $this->inventoryItemService->deleteItem($id);
            return back()->with('success', 'Data barang berhasil dihapus.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal menghapus data: ' . $e->getMessage()]);
        }
    }
}
