<?php

namespace Database\Seeders;

use App\Models\NotificationLog;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Carbon\Carbon;

class NotificationLogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');

        for ($i = 0; $i < 20; $i++) {
            $status = $faker->randomElement(['sent', 'sent', 'sent', 'pending', 'failed']);
            $errorMsg = null;
            if ($status === 'failed') {
                $errorMsg = $faker->randomElement(['Number not registered on WhatsApp', 'Timeout waiting for connection', 'WhatsApp instance offline']);
            }

            $messageTemplates = [
                "Yth. Bpk/Ibu, ini adalah pesan tagihan SPP anak Anda bulan ini.",
                "Pemberitahuan: Anak Anda tercatat Terlambat masuk sekolah hari ini pada pukul 07:15 WIB.",
                "Pemberitahuan: Anak Anda Alpa tanpa keterangan pada hari ini.",
                "Selamat pagi, mohon kehadirannya dalam rapat wali murid yang akan diselenggarakan besok.",
                "Terima kasih telah melakukan pembayaran administrasi sekolah.",
            ];

            NotificationLog::create([
                'type' => 'whatsapp',
                'recipient_number' => $faker->phoneNumber,
                'recipient_name' => $faker->name,
                'message_content' => $faker->randomElement($messageTemplates),
                'status' => $status,
                'error_message' => $errorMsg,
                'created_at' => Carbon::now()->subHours(rand(1, 48)),
                'updated_at' => Carbon::now(),
            ]);
        }
    }
}
