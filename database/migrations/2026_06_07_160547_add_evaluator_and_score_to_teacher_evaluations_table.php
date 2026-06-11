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
        Schema::table('teacher_evaluations', function (Blueprint $table) {
            $table->uuid('evaluator_id')->nullable()->after('teacher_id');
            $table->integer('score')->nullable()->after('feedback');
            
            $table->foreign('evaluator_id')->references('id')->on('users')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('teacher_evaluations', function (Blueprint $table) {
            $table->dropForeign(['evaluator_id']);
            $table->dropColumn(['evaluator_id', 'score']);
        });
    }
};
