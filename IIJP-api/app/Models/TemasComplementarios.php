<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TemasComplementarios extends Model
{
    use HasFactory;

   protected $fillable = [
        'restrictor',
        'descriptor',
        'tipo_jurisprudencia',
        'ratio',
    ];
    public function resolution()
    {
        return $this->hasOne(Resolutions::class);
    }
}
