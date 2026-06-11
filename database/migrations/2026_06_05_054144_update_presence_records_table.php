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
        Schema::table('presence_records', function (Blueprint $table) {
            $table->dropForeign(['student_id']);
            $table->dropColumn('student_id');
            $table->dropColumn('status');

            $table->uuidMorphs('person'); // Adds person_id and person_type
            $table->time('check_in')->nullable();
            $table->time('check_out')->nullable();
            $table->enum('status_in', ['tepat', 'terlambat'])->nullable();
            $table->enum('status_out', ['awal', 'tepat'])->nullable();
            
            $table->unique(['date', 'person_id', 'person_type'], 'presence_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('presence_records', function (Blueprint $table) {
            $table->dropUnique('presence_unique');
            $table->dropMorphs('person');
            $table->dropColumn(['check_in', 'check_out', 'status_in', 'status_out']);

            $table->foreignUuid('student_id')->constrained('students')->cascadeOnDelete();
            $table->enum('status', ['present', 'absent', 'late', 'sick'])->default('present');
        });
    }
};
