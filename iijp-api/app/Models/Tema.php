<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tema extends Model
{
    use HasFactory;
    protected $fillable = [
        'nombre',
        'tema_id',
    ];

    public function tema()
    {
        return $this->belongsTo(Tema::class, 'tema_id');
    }

    public function temas()
    {
        return $this->hasMany(Tema::class, 'tema_id');
    }

    public function resolutions()
    {
        return $this->hasMany(Resolutions::class);
    }
}
