<?php

namespace App\Http\Controllers\Admin\MasterData;

use App\Http\Controllers\Controller;
use App\Models\Major;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MajorController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->input('per_page', 10);
        $search = $request->input('search');

        $query = Major::withCount('students')->latest();

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $majors = $query->paginate($perPage);

        return Inertia::render('Admin/MasterData/UnifiedIndex', [
            'activeTab' => 'majors',
            'tabData' => $majors,
            'filters' => ['search' => $search, 'per_page' => $perPage]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:majors,name',
            'description' => 'nullable|string',
        ]);

        Major::create($validated);

        return redirect()->back()->with('success', 'Jurusan berhasil ditambahkan.');
    }

    public function update(Request $request, Major $major)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:majors,name,' . $major->id,
            'description' => 'nullable|string',
        ]);

        $major->update($validated);

        return redirect()->back()->with('success', 'Jurusan berhasil diperbarui.');
    }

    public function destroy(Major $major)
    {
        if ($major->students()->exists()) {
            return redirect()->back()->with('error', 'Jurusan tidak dapat dihapus karena masih memiliki siswa.');
        }

        $major->delete();

        return redirect()->back()->with('success', 'Jurusan berhasil dihapus.');
    }
}
