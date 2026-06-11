<?php

namespace App\Repositories;

use App\Models\AppSetting;

class AppSettingRepository
{
    /**
     * Get settings by specific keys
     */
    public function getByKeys(array $keys)
    {
        return AppSetting::whereIn('key', $keys)->get();
    }

    /**
     * Get all public settings
     */
    public function getAll()
    {
        return AppSetting::all();
    }
}
