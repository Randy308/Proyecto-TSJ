<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Spatie\SimpleExcel\SimpleExcelReader;

class DescriptorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $fullPath = storage_path('app/descriptor.csv');
        $rows = SimpleExcelReader::create($fullPath)->getRows();

        foreach ($rows as $index => $row) {
            try {
                DB::table('descriptors')->insert([
                    'id' => $row['id'] !== '' ? $row['id'] : null,
                    'nombre' => $row['nombre'] !== '' ? $row['nombre'] : "Desconocido",
                    'descriptor_id' => isset($row['descriptor_id']) && $row['descriptor_id'] !== '' ? $row['descriptor_id'] : null,
                ]);
            } catch (\Exception $e) {
                Log::error("Error en fila {$index}: " . $e->getMessage(), [
                    'row' => $row
                ]);
            }
        }
    }
}
