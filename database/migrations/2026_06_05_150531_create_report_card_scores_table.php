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
        Schema::create('report_card_scores', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('semester_id')->constrained('semesters')->cascadeOnDelete();
            $table->foreignUuid('student_id')->constrained('students')->cascadeOnDelete();
            $table->foreignUuid('subject_id')->constrained('subjects')->cascadeOnDelete();
            $table->foreignUuid('learning_objective_id')->constrained('learning_objectives')->cascadeOnDelete();
            $table->enum('report_type', ['mid_term', 'final_term'])->default('final_term');
            $table->decimal('pts_score', 5, 2)->nullable();
            $table->decimal('pas_score', 5, 2)->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['semester_id', 'student_id', 'subject_id', 'learning_objective_id'], 'report_score_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_card_scores');
    }
};
