<?php

namespace App\Http\Controllers\Admin\MasterData;

use App\Http\Controllers\Controller;
use App\Services\MasterData\StaffService;
use Illuminate\Http\Request;

class StaffController extends Controller
{
    public function __construct(
        protected StaffService $staffService
    ) {}

    public function index(Request $request)
    {
        $filters = $request->only(['search', 'per_page']);
        $perPage = $request->query('per_page', 10);
        $staffs = $this->staffService->getPaginatedStaff($perPage, $filters);
        
        return \Inertia\Inertia::render('Admin/MasterData/UnifiedIndex', [
            'activeTab' => 'staffs',
            'tabData' => $staffs,
            'filters' => $filters
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nip' => 'nullable|string|max:255|unique:staffs,nip',
            'nama_lengkap' => 'required|string|max:255',
            'jabatan' => 'nullable|string|max:255',
            'no_hp' => 'nullable|string|max:20',
            'alamat' => 'nullable|string',
            'jenis_kelamin' => 'nullable|in:L,P',
        ]);

        $this->staffService->createStaff($validated);

        return redirect()->back()->with('success', 'Data staf berhasil ditambahkan.');
    }

    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'nip' => 'nullable|string|max:255|unique:staffs,nip,' . $id,
            'nama_lengkap' => 'required|string|max:255',
            'jabatan' => 'nullable|string|max:255',
            'no_hp' => 'nullable|string|max:20',
            'alamat' => 'nullable|string',
            'jenis_kelamin' => 'nullable|in:L,P',
        ]);

        $this->staffService->updateStaff($id, $validated);

        return redirect()->back()->with('success', 'Data staf berhasil diperbarui.');
    }

    public function destroy(string $id)
    {
        $this->staffService->deleteStaff($id);

        return redirect()->back()->with('success', 'Data staf berhasil dihapus.');
    }
}
