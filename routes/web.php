<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\Public\PublicPortalController;

Route::get('/', [PublicPortalController::class, 'index'])->name('home');

use App\Http\Controllers\DashboardController;

Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Admin Master Data Routes
    Route::middleware('role:admin')->prefix('admin/master')->name('admin.master.')->group(function () {
        Route::resource('teachers', \App\Http\Controllers\Admin\MasterData\TeacherController::class);
        Route::resource('staffs', \App\Http\Controllers\Admin\MasterData\StaffController::class);
        Route::resource('students', \App\Http\Controllers\Admin\MasterData\StudentController::class);
        Route::resource('majors', \App\Http\Controllers\Admin\MasterData\MajorController::class);
        Route::resource('semesters', \App\Http\Controllers\Admin\MasterData\SemesterController::class);
        Route::resource('school-classes', \App\Http\Controllers\Admin\MasterData\SchoolClassController::class);
        Route::resource('subjects', \App\Http\Controllers\Admin\MasterData\SubjectController::class);
        Route::resource('time-slots', \App\Http\Controllers\Admin\MasterData\TimeSlotController::class);
    });

    // Admin Eskul Routes
    Route::middleware('role:admin')->prefix('admin/eskul')->name('admin.eskul.')->group(function () {
        Route::resource('extracurriculars', \App\Http\Controllers\Admin\Eskul\ExtracurricularController::class);
        Route::post('extracurriculars/{extracurricular}/sync-members', [\App\Http\Controllers\Admin\Eskul\ExtracurricularController::class, 'syncMembers'])->name('extracurriculars.sync-members');
        Route::resource('eskul-schedules', \App\Http\Controllers\Admin\Eskul\EskulScheduleController::class);
    });

    // Admin Academic Routes
    Route::middleware('role:admin,teacher')->prefix('admin/academic')->name('admin.academic.')->group(function () {
        Route::resource('schedules', \App\Http\Controllers\Admin\Academic\ScheduleController::class)->only(['index', 'store', 'destroy']);
        Route::resource('journals', \App\Http\Controllers\Admin\Academic\JournalController::class)->only(['index', 'store', 'show', 'destroy']);
        Route::resource('daily-assessments', \App\Http\Controllers\Admin\Academic\DailyAssessmentController::class)->only(['index', 'store', 'show', 'update', 'destroy']);
        Route::resource('substitutions', \App\Http\Controllers\Admin\Academic\SubstitutionController::class)->only(['index', 'store', 'destroy']);
        Route::resource('administrations', \App\Http\Controllers\Admin\Academic\TeacherAdministrationController::class)->only(['index', 'store', 'destroy']);
        
        Route::post('evaluations/auto-generate', [\App\Http\Controllers\Admin\Academic\TeacherEvaluationController::class, 'autoGenerate'])->name('evaluations.auto-generate');
        Route::resource('evaluations', \App\Http\Controllers\Admin\Academic\TeacherEvaluationController::class)->only(['store', 'destroy']);
        
        Route::resource('attendances', \App\Http\Controllers\Admin\Academic\AttendanceController::class)->only(['index', 'store']);
        Route::get('daily-attendance-recaps', [\App\Http\Controllers\Admin\Academic\DailyAttendanceRecapController::class, 'index'])->name('daily-attendance-recaps.index');
    });

    // Admin Presence Routes
    Route::middleware('role:admin,teacher')->prefix('admin/presence')->name('admin.presence.')->group(function () {
        Route::get('scanner', [\App\Http\Controllers\Admin\PresenceController::class, 'scanner'])->name('scanner');
        Route::post('scan', [\App\Http\Controllers\Admin\PresenceController::class, 'scan'])->name('scan');
        Route::get('recap', [\App\Http\Controllers\Admin\PresenceController::class, 'recap'])->name('recap');
    });

    // Discipline Routes
    Route::prefix('discipline')->name('discipline.')->group(function () {
        Route::resource('violations', \App\Http\Controllers\Admin\Discipline\ViolationController::class)->only(['index', 'store', 'update', 'destroy']);
    });

    // Admin Finance Routes
    Route::middleware('role:admin')->prefix('admin/finance')->name('admin.finance.')->group(function () {
        Route::get('spp', [\App\Http\Controllers\Admin\Finance\SppPaymentController::class, 'index'])->name('spp.index');
        Route::post('spp', [\App\Http\Controllers\Admin\Finance\SppPaymentController::class, 'store'])->name('spp.store');
        Route::post('spp/generate', [\App\Http\Controllers\Admin\Finance\SppPaymentController::class, 'generate'])->name('spp.generate');
    });

    // Admin Assessment Routes
    Route::middleware('role:admin,teacher')->prefix('admin/assessment')->name('admin.assessment.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\Assessment\AssessmentController::class, 'index'])->name('index');
        Route::post('/learning-objectives', [\App\Http\Controllers\Admin\Assessment\AssessmentController::class, 'storeLearningObjective'])->name('learning-objectives.store');
        Route::post('/', [\App\Http\Controllers\Admin\Assessment\AssessmentController::class, 'storeAssessment'])->name('store');
    });

    // Admin Report Card Routes
    Route::middleware('role:admin,teacher')->prefix('admin/report-cards')->name('admin.report-cards.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\Assessment\ReportCardController::class, 'index'])->name('index');
        Route::get('/{studentId}/{semesterId}', [\App\Http\Controllers\Admin\Assessment\ReportCardController::class, 'show'])->name('show');
        Route::post('/{studentId}/{semesterId}/generate', [\App\Http\Controllers\Admin\Assessment\ReportCardController::class, 'generate'])->name('generate');
        Route::get('/{studentId}/{semesterId}/print', [\App\Http\Controllers\Admin\Assessment\ReportCardController::class, 'printPdf'])->name('print');
    });

    // Admin PPDB Routes
    Route::middleware('role:admin')->prefix('admin/ppdb')->name('admin.ppdb.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\PPDB\ApplicantController::class, 'index'])->name('index');
        Route::get('/{id}', [\App\Http\Controllers\Admin\PPDB\ApplicantController::class, 'show'])->name('show');
        Route::post('/{id}/approve', [\App\Http\Controllers\Admin\PPDB\ApplicantController::class, 'approve'])->name('approve');
        Route::post('/{id}/reject', [\App\Http\Controllers\Admin\PPDB\ApplicantController::class, 'reject'])->name('reject');
    });

    // Admin Sarpras Routes
    Route::middleware('role:admin')->prefix('admin/sarpras')->name('admin.sarpras.')->group(function () {
        Route::resource('inventories', \App\Http\Controllers\Admin\Sarpras\InventoryItemController::class)->except(['create', 'show', 'edit']);
    });

    // Admin Tracer Study Routes
    Route::middleware('role:admin')->prefix('admin/tracer-studies')->name('admin.tracer-studies.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\TracerStudy\TracerStudyController::class, 'index'])->name('index');
    });

    // Admin Settings - WhatsApp
    Route::middleware('role:admin')->prefix('admin/settings/whatsapp')->name('admin.settings.whatsapp.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\Settings\WhatsAppController::class, 'index'])->name('index');
        Route::get('/qr', [\App\Http\Controllers\Admin\Settings\WhatsAppController::class, 'getQr'])->name('qr');
        Route::post('/test', [\App\Http\Controllers\Admin\Settings\WhatsAppController::class, 'testMessage'])->name('test');
        Route::post('/logout', [\App\Http\Controllers\Admin\Settings\WhatsAppController::class, 'logout'])->name('logout');
    });

    // Admin Settings - Database
    Route::middleware('role:admin')->prefix('admin/settings/database')->name('admin.settings.database.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\Settings\DatabaseController::class, 'index'])->name('index');
        Route::get('/export', [\App\Http\Controllers\Admin\Settings\DatabaseController::class, 'export'])->name('export');
        Route::post('/import', [\App\Http\Controllers\Admin\Settings\DatabaseController::class, 'import'])->name('import');
        Route::post('/reset', [\App\Http\Controllers\Admin\Settings\DatabaseController::class, 'reset'])->name('reset');
    });

    // Student Portal Routes
    Route::middleware('role:student')->prefix('student')->name('student.')->group(function () {
        Route::get('schedules', [\App\Http\Controllers\Student\ScheduleController::class, 'index'])->name('schedules.index');
        Route::get('attendances', [\App\Http\Controllers\Student\AttendanceController::class, 'index'])->name('attendances.index');
        Route::get('daily-attendance-recaps', [\App\Http\Controllers\Student\DailyAttendanceRecapController::class, 'index'])->name('daily-attendance-recaps.index');
        Route::get('report-cards', [\App\Http\Controllers\Student\ReportCardController::class, 'index'])->name('report-cards.index');
        Route::get('violations', [\App\Http\Controllers\Student\ViolationController::class, 'index'])->name('violations.index');
        Route::get('finance', [\App\Http\Controllers\Student\FinanceController::class, 'index'])->name('finance.index');
    });
});

// Public PPDB Routes
Route::prefix('ppdb')->name('ppdb.')->group(function () {
    Route::get('/', [\App\Http\Controllers\Public\PPDBController::class, 'index'])->name('index');
    Route::post('/', [\App\Http\Controllers\Public\PPDBController::class, 'store'])->name('store');
    Route::get('/success', [\App\Http\Controllers\Public\PPDBController::class, 'success'])->name('success');
});

// Public Tracer Study Routes
Route::prefix('alumni/tracer-study')->name('alumni.tracer-study.')->group(function () {
    Route::get('/', [\App\Http\Controllers\Public\TracerStudyController::class, 'index'])->name('index');
    Route::post('/verify', [\App\Http\Controllers\Public\TracerStudyController::class, 'verify'])->name('verify');
    Route::post('/', [\App\Http\Controllers\Public\TracerStudyController::class, 'store'])->name('store');
});

// Buku Induk
Route::middleware('auth', 'role:admin,teacher')->prefix('admin/buku-induk')->name('admin.buku-induk.')->group(function () {
    Route::get('/', [\App\Http\Controllers\Admin\BukuIndukController::class, 'index'])->name('index');
    Route::get('/{id}', [\App\Http\Controllers\Admin\BukuIndukController::class, 'show'])->name('show');
    Route::put('/{id}', [\App\Http\Controllers\Admin\BukuIndukController::class, 'update'])->name('update');
});

// Graduation
Route::middleware('auth', 'role:admin')->prefix('admin/graduation')->name('admin.graduation.')->group(function () {
    Route::get('/', [\App\Http\Controllers\Admin\GraduationController::class, 'index'])->name('index');
    Route::post('/bulk-graduate', [\App\Http\Controllers\Admin\GraduationController::class, 'bulkGraduate'])->name('bulk-graduate');
    Route::get('/alumni', [\App\Http\Controllers\Admin\GraduationController::class, 'alumniList'])->name('alumni');
    Route::post('/alumni/{student}/ijazah', [\App\Http\Controllers\Admin\GraduationController::class, 'updateIjazah'])->name('update-ijazah');
    Route::get('/alumni/{student}/skl', [\App\Http\Controllers\Admin\GraduationController::class, 'printSkl'])->name('print-skl');
});

// Import Export
Route::middleware('auth', 'role:admin')->prefix('admin/import-export')->name('admin.import-export.')->group(function () {
    Route::get('/', [\App\Http\Controllers\Admin\ImportExportController::class, 'index'])->name('index');
    Route::post('/import', [\App\Http\Controllers\Admin\ImportExportController::class, 'import'])->name('import');
    Route::get('/export', [\App\Http\Controllers\Admin\ImportExportController::class, 'export'])->name('export');
    Route::get('/template', [\App\Http\Controllers\Admin\ImportExportController::class, 'downloadTemplate'])->name('template');
});

// Global Reporting
Route::middleware('auth', 'role:admin,headmaster')->prefix('admin/reports')->name('admin.reports.')->group(function () {
    Route::get('/', [\App\Http\Controllers\Admin\ReportController::class, 'index'])->name('index');
    Route::get('/summary', [\App\Http\Controllers\Admin\ReportController::class, 'getSummary'])->name('summary');
    Route::get('/export-pdf', [\App\Http\Controllers\Admin\ReportController::class, 'exportPdf'])->name('export-pdf');
});

require __DIR__.'/auth.php';
