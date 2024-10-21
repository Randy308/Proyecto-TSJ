<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Jurisprudencias extends Model
{
    use HasFactory;

   protected $fillable = [
        'restrictor',
        'resolution_id',
        'descriptor',
        'tipo_jurisprudencia',
        'ratio',
    ];
    public function resolution()
    {
        return $this->hasOne(Resolutions::class);
    }
}
