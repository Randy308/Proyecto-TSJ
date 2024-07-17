<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Salas extends Model
{
    use HasFactory;

    protected $fillable = [
        'sala'
    ];

    public function resolutions()
    {
        return $this->hasMany(Resolutions::class);
    }
}
