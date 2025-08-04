<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Spatie\SimpleExcel\SimpleExcelReader;

class ImportResuelveFondo implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */

    protected string $filePath;
    protected int $userId;
    protected int $salaId;
    public function __construct(string $filePath, int $userId, int $salaId)
    {
        $this->filePath = $filePath;
        $this->userId = $userId;
        $this->salaId = $salaId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $fullPath = storage_path('app/' . $this->filePath);
        SimpleExcelReader::create($fullPath)
            ->useDelimiter(',')
            ->getRows()
            ->chunk(700)
            ->each(
                fn($chunk) => ImportDecisionesChunk::dispatch($chunk, $this->userId, $this->salaId)
            );
    }
}
