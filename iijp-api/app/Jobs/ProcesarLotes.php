<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class ProcesarLotes implements ShouldQueue
{
    use Queueable;


    protected int $iterations;
    protected int $lastId;
    protected int $userId;
    protected string $jobId;

    public function __construct(int $iterations, int $lastId, int $userId)
    {
        $this->iterations = $iterations;
        $this->lastId = $lastId;
        $this->userId = $userId;
        $this->jobId = uniqid('scrape_', true);
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $total = $this->lastId + $this->iterations;
        $batchSize = 20; // Tamaño del lote
        for ($start = $this->lastId; $start < $total; $start += $batchSize) {
            $lote = [
                'start' => $start,
                'end' => min($start + $batchSize - 1, $total - 1),
                'user_id' => $this->userId,
                'job_id' => $this->jobId,
                'batch_size' => $batchSize,
            ];
            Log::info("Procesando $lote[start] a $lote[end] para el usuario $lote[user_id] con job_id $lote[job_id]");


            ProcesarWebScrapping::dispatch($lote);
        }
    }
}
