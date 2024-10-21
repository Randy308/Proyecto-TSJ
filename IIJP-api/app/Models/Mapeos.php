<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Mapeos extends Model
{
    use HasFactory;
    protected $fillable = [
        'external_id',
        'resolution_id'
    ];
    public function resolution()
    {
        return $this->belongsTo(Resolutions::class);
    }
}
