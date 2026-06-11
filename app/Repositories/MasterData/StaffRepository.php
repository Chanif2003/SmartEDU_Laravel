<?php

namespace App\Repositories\MasterData;

use App\Models\Staff;
use App\Models\User;
use App\Repositories\Contracts\StaffRepositoryInterface;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StaffRepository implements StaffRepositoryInterface
{
    public function getPaginated(int $perPage = 10, array $filters = [])
    {
        $query = Staff::with('user');

        if (!empty($filters['search'])) {
            $query->where('nama_lengkap', 'like', '%' . $filters['search'] . '%')
                  ->orWhere('nip', 'like', '%' . $filters['search'] . '%');
        }

        return $query->paginate($perPage);
    }

    public function find(string $id)
    {
        return Staff::with('user')->findOrFail($id);
    }

    public function create(array $data)
    {
        return DB::transaction(function () use ($data) {
            $user = User::create([
                'name' => $data['nama_lengkap'],
                'username' => strtolower(str_replace(' ', '', $data['nama_lengkap'])) . rand(100, 999),
                'password' => Hash::make('password123'),
                'role' => 'staff',
            ]);

            return Staff::create([
                'user_id' => $user->id,
                'nip' => $data['nip'] ?? null,
                'nama_lengkap' => $data['nama_lengkap'],
                'jabatan' => $data['jabatan'] ?? null,
                'no_hp' => $data['no_hp'] ?? null,
                'alamat' => $data['alamat'] ?? null,
                'jenis_kelamin' => $data['jenis_kelamin'] ?? null,
            ]);
        });
    }

    public function update(string $id, array $data)
    {
        return DB::transaction(function () use ($id, $data) {
            $staff = Staff::findOrFail($id);
            $staff->update([
                'nip' => $data['nip'] ?? $staff->nip,
                'nama_lengkap' => $data['nama_lengkap'] ?? $staff->nama_lengkap,
                'jabatan' => $data['jabatan'] ?? $staff->jabatan,
                'no_hp' => $data['no_hp'] ?? $staff->no_hp,
                'alamat' => $data['alamat'] ?? $staff->alamat,
                'jenis_kelamin' => $data['jenis_kelamin'] ?? $staff->jenis_kelamin,
            ]);

            if ($staff->user) {
                $staff->user->update([
                    'name' => $data['nama_lengkap'] ?? $staff->user->name,
                ]);
            }

            return $staff;
        });
    }

    public function delete(string $id)
    {
        return DB::transaction(function () use ($id) {
            $staff = Staff::findOrFail($id);
            if ($staff->user) {
                $staff->user->delete();
            }
            return $staff->delete();
        });
    }
}
