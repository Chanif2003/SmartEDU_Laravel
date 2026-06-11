<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

use App\Repositories\Contracts\Presence\PresenceRecordRepositoryInterface;
use App\Repositories\Presence\PresenceRecordRepository;
use App\Repositories\Contracts\Academic\AttendanceRepositoryInterface;
use App\Repositories\Academic\AttendanceRepository;
use App\Repositories\Contracts\Finance\SppPaymentRepositoryInterface;
use App\Repositories\Finance\SppPaymentRepository;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(
            \App\Repositories\Contracts\UserRepositoryInterface::class,
            \App\Repositories\UserRepository::class
        );
        $this->app->bind(
            \App\Repositories\Contracts\DashboardRepositoryInterface::class,
            \App\Repositories\DashboardRepository::class
        );
        $this->app->bind(
            \App\Repositories\Contracts\Admin\Discipline\ViolationRepositoryInterface::class,
            \App\Repositories\Admin\Discipline\ViolationRepository::class
        );
        $this->app->bind(
            \App\Repositories\Contracts\Admin\Academic\JournalRepositoryInterface::class,
            \App\Repositories\Admin\Academic\JournalRepository::class
        );
        $this->app->bind(
            \App\Repositories\Contracts\Admin\Academic\SubstitutionRepositoryInterface::class,
            \App\Repositories\Admin\Academic\SubstitutionRepository::class
        );
        $this->app->bind(
            \App\Repositories\Contracts\Admin\Academic\TeacherAdministrationRepositoryInterface::class,
            \App\Repositories\Admin\Academic\TeacherAdministrationRepository::class
        );
        $this->app->bind(
            \App\Repositories\Contracts\Admin\Academic\TeacherEvaluationRepositoryInterface::class,
            \App\Repositories\Admin\Academic\TeacherEvaluationRepository::class
        );

        $entities = ['Teacher', 'Staff', 'Student', 'Semester', 'SchoolClass', 'Subject', 'TimeSlot'];
        foreach ($entities as $entity) {
            $this->app->bind(
                "App\\Repositories\\Contracts\\{$entity}RepositoryInterface",
                "App\\Repositories\\MasterData\\{$entity}Repository"
            );
        }

        $this->app->bind(
            \App\Repositories\Contracts\Presence\PresenceRecordRepositoryInterface::class,
            \App\Repositories\Presence\PresenceRecordRepository::class
        );
        $this->app->bind(
            \App\Repositories\Contracts\Academic\AttendanceRepositoryInterface::class,
            \App\Repositories\Academic\AttendanceRepository::class
        );
        $this->app->bind(
            \App\Repositories\Contracts\Finance\SppPaymentRepositoryInterface::class,
            \App\Repositories\Finance\SppPaymentRepository::class
        );
        $this->app->bind(
            \App\Repositories\Contracts\Assessment\AssessmentRepositoryInterface::class,
            \App\Repositories\Assessment\AssessmentRepository::class
        );
        $this->app->bind(
            \App\Repositories\Contracts\Assessment\ReportCardRepositoryInterface::class,
            \App\Repositories\Assessment\ReportCardRepository::class
        );
        $this->app->bind(
            \App\Repositories\Contracts\ApplicantRepositoryInterface::class,
            \App\Repositories\ApplicantRepository::class
        );
        
        $this->app->bind(
            \App\Repositories\Contracts\InventoryItemRepositoryInterface::class,
            \App\Repositories\InventoryItemRepository::class
        );
        
        $this->app->bind(
            \App\Repositories\Contracts\TracerStudyRepositoryInterface::class,
            \App\Repositories\TracerStudyRepository::class
        );

        $this->app->bind(
            \App\Repositories\Contracts\Admin\BukuIndukRepositoryInterface::class,
            \App\Repositories\Admin\BukuIndukRepository::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
    }
}
