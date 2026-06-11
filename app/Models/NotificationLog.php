<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotificationLog extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'type',
        'recipient_number',
        'recipient_name',
        'message_content',
        'status',
        'error_message',
    ];
}
