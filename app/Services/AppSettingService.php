<?php

namespace App\Services;

use App\Repositories\AppSettingRepository;

class AppSettingService
{
    protected AppSettingRepository $appSettingRepository;

    public function __construct(AppSettingRepository $appSettingRepository)
    {
        $this->appSettingRepository = $appSettingRepository;
    }

    /**
     * Get public school profile as key-value pair array
     */
    public function getPublicProfile(): array
    {
        $keys = [
            'school_name',
            'school_slogan',
            'school_address',
            'school_email',
            'school_phone',
            'ppdb_is_open',
            'hero_title',
            'hero_subtitle'
        ];

        $settings = $this->appSettingRepository->getByKeys($keys);
        
        $profile = [];
        foreach ($settings as $setting) {
            // format boolean correctly
            if ($setting->type === 'boolean') {
                $profile[$setting->key] = (bool) $setting->value;
            } else {
                $profile[$setting->key] = $setting->value;
            }
        }

        // Add fallbacks if not seeded
        return [
            'school_name' => $profile['school_name'] ?? 'SMK Negeri 1 Nusantara',
            'school_slogan' => $profile['school_slogan'] ?? 'Mencetak Generasi Unggul dan Berkarakter',
            'school_address' => $profile['school_address'] ?? '-',
            'school_email' => $profile['school_email'] ?? '-',
            'school_phone' => $profile['school_phone'] ?? '-',
            'ppdb_is_open' => $profile['ppdb_is_open'] ?? true,
            'hero_title' => $profile['hero_title'] ?? 'Selamat Datang di Portal Edukasi',
            'hero_subtitle' => $profile['hero_subtitle'] ?? 'Platform manajemen sekolah terpadu.',
        ];
    }
}
