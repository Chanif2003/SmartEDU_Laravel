<?php

namespace App\Http\Controllers\Admin\TracerStudy;

use App\Http\Controllers\Controller;
use App\Http\Resources\TracerStudyResource;
use App\Repositories\Contracts\TracerStudyRepositoryInterface;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TracerStudyController extends Controller
{
    protected $tracerStudyRepository;

    public function __construct(TracerStudyRepositoryInterface $tracerStudyRepository)
    {
        $this->tracerStudyRepository = $tracerStudyRepository;
    }

    public function index(Request $request)
    {
        $filters = $request->only(['graduation_year', 'status', 'search']);
        $perPage = $request->query('per_page', 10);
        $filters['per_page'] = $perPage;
        
        $tracerStudies = $this->tracerStudyRepository->paginate($perPage, $filters);
        $statistics = $this->tracerStudyRepository->getStatistics($filters);
        $yearlyStatistics = $this->tracerStudyRepository->getYearlyStatistics();

        // Format statistics for Recharts
        $chartData = $statistics->map(function ($stat) {
            $labels = [
                'working' => 'Bekerja',
                'studying' => 'Kuliah',
                'entrepreneur' => 'Wirausaha',
                'seeking' => 'Mencari Kerja',
                'other' => 'Lainnya',
            ];
            
            return [
                'name' => $labels[$stat->status] ?? $stat->status,
                'value' => (int) $stat->total,
                'status' => $stat->status,
            ];
        });

        return Inertia::render('Admin/TracerStudy/Index', [
            'tracerStudies' => TracerStudyResource::collection($tracerStudies),
            'statistics' => $chartData,
            'yearlyStatistics' => $yearlyStatistics,
            'filters' => $filters,
        ]);
    }
}
