<?php

namespace App\Http\Controllers;

use App\Services\DashboardService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected DashboardService $dashboardService;

    public function __construct(DashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }

    public function index(Request $request)
    {
        $metricsData = $this->dashboardService->getDashboardMetrics($request->user());

        return Inertia::render('Dashboard', [
            'dashboardData' => $metricsData
        ]);
    }
}
