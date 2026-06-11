<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Presence\ScanRequest;
use App\Services\Presence\PresenceService;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PresenceController extends Controller
{
    public function __construct(
        protected PresenceService $presenceService
    ) {}

    public function scanner(Request $request)
    {
        $type = $request->query('type', 'student');
        return Inertia::render('Admin/Presence/Scanner', [
            'scannerType' => $type
        ]);
    }

    public function scan(ScanRequest $request)
    {
        try {
            $result = $this->presenceService->scanQr($request->validated('qr_code'));
            return redirect()->back()->with('success', 'Berhasil ' . $result['type'] . ' - ' . $result['person']->name . ' (' . $result['status'] . ')');
        } catch (Exception $e) {
            return redirect()->back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    public function recap(Request $request)
    {
        $type = $request->query('type', 'student');
        $date = $request->query('date', now()->toDateString());
        
        $query = \App\Models\PresenceRecord::with('person')->where('date', $date);
        
        if ($type === 'student') {
            $query->where('person_type', \App\Models\Student::class);
        } else {
            // 'staff' includes both Teacher and Staff
            $query->whereIn('person_type', [\App\Models\Teacher::class, \App\Models\Staff::class]);
        }
        
        $records = $query->orderBy('created_at', 'desc')->get();
        
        // Return mapped data to ensure person name is easily accessible
        $mappedRecords = $records->map(function($record) {
            return [
                'id' => $record->id,
                'date' => $record->date,
                'check_in' => $record->check_in,
                'check_out' => $record->check_out,
                'status_in' => $record->status_in,
                'status_out' => $record->status_out,
                'person_name' => $record->person ? ($record->person->nama_lengkap ?? $record->person->name ?? 'Unknown') : 'Unknown',
                'person_type' => class_basename($record->person_type),
                'identifier' => $record->person ? ($record->person->nisn ?? $record->person->nip ?? $record->person->email ?? '-') : '-'
            ];
        });

        return Inertia::render('Admin/Presence/RecapIndex', [
            'records' => $mappedRecords,
            'type' => $type,
            'date' => $date
        ]);
    }
}
