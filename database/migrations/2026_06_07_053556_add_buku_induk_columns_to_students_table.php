<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->enum('registration_type', ['baru', 'pindahan'])->default('baru');
            $table->string('origin_school')->nullable();
            $table->date('entry_date')->nullable();
            $table->foreignUuid('entry_semester_id')->nullable()->constrained('semesters')->nullOnDelete();
            $table->date('exit_date')->nullable();
            $table->string('exit_reason')->nullable();
            $table->text('notes_buku_induk')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropForeign(['entry_semester_id']);
            $table->dropColumn([
                'registration_type',
                'origin_school',
                'entry_date',
                'entry_semester_id',
                'exit_date',
                'exit_reason',
                'notes_buku_induk'
            ]);
        });
    }
};
