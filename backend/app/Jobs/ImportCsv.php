<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Spatie\SimpleExcel\SimpleExcelReader;

class ImportCsv implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */

    protected string $filePath;
    protected int $userId;
    public function __construct(string $filePath, int $userId)
    {
        $this->filePath = $filePath;
        $this->userId = $userId;
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
            ->chunk(1000)
            ->each(
                fn($chunk) => ImportResolutionChunk::dispatch($chunk, $this->userId)
            );
    }
}
