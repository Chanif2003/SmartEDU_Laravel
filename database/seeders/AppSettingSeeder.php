<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\AppSetting;

class AppSettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            ['key' => 'school_name', 'value' => 'SMK Negeri 1 Nusantara', 'type' => 'string'],
            ['key' => 'school_slogan', 'value' => 'Mencetak Generasi Unggul dan Berkarakter', 'type' => 'string'],
            ['key' => 'school_address', 'value' => 'Jl. Pendidikan No. 123, Kota Cerdas', 'type' => 'string'],
            ['key' => 'school_email', 'value' => 'info@smkn1nusantara.sch.id', 'type' => 'string'],
            ['key' => 'school_phone', 'value' => '+62 812 3456 7890', 'type' => 'string'],
            ['key' => 'ppdb_is_open', 'value' => '1', 'type' => 'boolean'],
            ['key' => 'hero_title', 'value' => 'Selamat Datang di Portal Edukasi SMAN 1 Nusantara', 'type' => 'string'],
            ['key' => 'hero_subtitle', 'value' => 'Platform manajemen sekolah terpadu yang memfasilitasi kegiatan belajar mengajar secara modern dan komprehensif.', 'type' => 'string'],
        ];

        foreach ($settings as $setting) {
            AppSetting::updateOrCreate(['key' => $setting['key']], $setting);
        }
    }
}
