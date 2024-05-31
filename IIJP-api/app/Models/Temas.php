<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Temas extends Model
{
    use HasFactory;
    protected $fillable = [
        'nombre',
        'tema_id',
    ];

    public function tema()
    {
        return $this->belongsTo(Temas::class, 'tema_id');
    }

    public function temas()
    {
        return $this->hasMany(Temas::class, 'tema_id');
    }

    public function resolutions()
    {
        return $this->hasMany(Resolutions::class);
    }
}
