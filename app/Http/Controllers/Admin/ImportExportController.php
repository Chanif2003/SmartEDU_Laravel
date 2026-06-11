<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ImportDataRequest;
use App\Services\ImportExportService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ImportExportController extends Controller
{
    protected ImportExportService $importExportService;

    public function __construct(ImportExportService $importExportService)
    {
        $this->importExportService = $importExportService;
    }

    /**
     * Display the import/export view.
     */
    public function index()
    {
        return Inertia::render('Admin/ImportExport/Index');
    }

    /**
     * Handle the import of data.
     */
    public function import(ImportDataRequest $request)
    {
        $result = $this->importExportService->importData(
            $request->input('type'),
            $request->file('file'),
            $request->input('class_id')
        );

        if ($result['status'] === 'error') {
            return response()->json([
                'message' => $result['message'],
                'errors' => $result['errors'] ?? []
            ], 422);
        }

        return response()->json([
            'message' => $result['message']
        ], 200);
    }

    /**
     * Handle the export of data.
     */
    public function export(Request $request)
    {
        $request->validate([
            'type' => 'required|string|in:students,teachers,staffs,subjects,classes'
        ]);

        return $this->importExportService->exportData(
            $request->input('type'),
            $request->input('class_id')
        );
    }

    /**
     * Download the empty template for importing.
     */
    public function downloadTemplate(Request $request)
    {
        $request->validate([
            'type' => 'required|string|in:students,teachers,staffs,subjects,classes'
        ]);

        return $this->importExportService->exportData(
            $request->input('type'),
            'template_only_no_data_expected_use_fake_id_to_return_empty'
        );
    }
}
