<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\InventoryItem;
use Faker\Factory as Faker;
use Carbon\Carbon;

class InventorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');

        $categories = ['Elektronik', 'Furnitur', 'Buku', 'Alat Tulis', 'Peralatan Olahraga'];
        $conditions = ['baik', 'baik', 'baik', 'rusak_ringan', 'rusak_berat', 'hilang'];
        $locations = ['Ruang Guru', 'Lab Komputer 1', 'Lab Komputer 2', 'Perpustakaan', 'Gudang', 'Ruang Kelas X-A', 'Ruang Kelas X-B'];

        for ($i = 1; $i <= 30; $i++) {
            $category = $faker->randomElement($categories);
            
            // Generate some random names based on category
            if ($category == 'Elektronik') {
                $name = $faker->randomElement(['Laptop Asus ROG', 'PC Desktop Lenovo', 'Proyektor Epson', 'Printer Canon', 'AC Daikin 1 PK']);
            } elseif ($category == 'Furnitur') {
                $name = $faker->randomElement(['Meja Siswa', 'Kursi Siswa', 'Papan Tulis Whiteboard', 'Lemari Arsip', 'Meja Guru']);
            } elseif ($category == 'Buku') {
                $name = $faker->randomElement(['Buku Paket Matematika Kelas X', 'Kamus Bahasa Inggris', 'Ensiklopedi Sains']);
            } else {
                $name = $faker->words(3, true);
            }

            InventoryItem::create([
                'item_code' => 'INV-' . strtoupper(substr($category, 0, 3)) . '-' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'name' => ucwords($name),
                'category' => $category,
                'condition' => $faker->randomElement($conditions),
                'location' => $faker->randomElement($locations),
                'quantity' => $faker->numberBetween(1, 20),
                'notes' => $faker->optional(0.7)->sentence(),
                'last_checked_at' => Carbon::now()->subDays(rand(1, 60)),
            ]);
        }
    }
}
