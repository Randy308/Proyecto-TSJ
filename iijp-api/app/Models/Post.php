<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $table = 'posts';

    protected $fillable = [
        'user_id',
        'titulo',
        'description',
        'ruta_imagen',
        'estado'
    ];

    /**
     * Relación con el usuario que creó la publicación
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
