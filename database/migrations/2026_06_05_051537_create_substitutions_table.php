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
        Schema::create('substitutions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->date('date')->index();
            $table->uuid('schedule_id');
            $table->uuid('original_teacher_id');
            $table->uuid('substitute_teacher_id');
            $table->string('absence_reason');
            $table->string('topic');
            $table->json('records')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('schedule_id')->references('id')->on('schedules')->onDelete('cascade');
            $table->foreign('original_teacher_id')->references('id')->on('teachers')->onDelete('cascade');
            $table->foreign('substitute_teacher_id')->references('id')->on('teachers')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('substitutions');
    }
};
