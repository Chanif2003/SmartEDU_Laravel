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
        Schema::create('student_report_cards', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('semester_id')->constrained('semesters')->cascadeOnDelete();
            $table->foreignUuid('student_id')->constrained('students')->cascadeOnDelete();
            $table->enum('status', ['draft', 'published'])->default('draft');
            $table->text('spiritual_attitude')->nullable();
            $table->text('social_attitude')->nullable();
            $table->integer('sick_days')->default(0);
            $table->integer('permission_days')->default(0);
            $table->integer('absent_days')->default(0);
            $table->text('notes')->nullable();
            $table->json('extracurricular_notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['semester_id', 'student_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_report_cards');
    }
};
