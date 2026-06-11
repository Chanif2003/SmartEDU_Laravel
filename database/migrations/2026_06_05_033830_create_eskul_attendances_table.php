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
        Schema::create('eskul_attendances', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->date('date');
            $table->uuid('eskul_schedule_id')->index();
            $table->uuid('extracurricular_id')->index();
            $table->uuid('coach_id')->nullable()->index();
            $table->string('topic');
            $table->text('notes')->nullable();
            $table->json('records'); // { "student_id": "status" }
            $table->timestamps();

            $table->foreign('eskul_schedule_id')->references('id')->on('eskul_schedules')->cascadeOnDelete();
            $table->foreign('extracurricular_id')->references('id')->on('extracurriculars')->cascadeOnDelete();
            $table->foreign('coach_id')->references('id')->on('teachers')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('eskul_attendances');
    }
};
