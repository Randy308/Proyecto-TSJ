<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserEstilos extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'estilo_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function estilo()
    {
        return $this->belongsTo(Estilos::class);
    }
}