<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $nombre
 * @property string $fontFamily
 * @property string $textAlign
 * @property string $fontStyle
 * @property string $fontWeight
 * @property string $textDecoration
 * @property string $color
 * @property int $marginTop
 * @property int $paddingBottom
 * @property int $marginLeft
 * @property string $fontSize
 * @property string|null $tipo
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\User> $users
 * @property-read int|null $users_count
 * @mixin \Eloquent
 */
class Estilo extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'fontFamily',
        'textAlign',
        'fontStyle',
        'fontWeight',
        'textDecoration',
        'color',
        'marginTop',
        'paddingBottom',
        'marginLeft',
        'fontSize',
        'tipo',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_estilos');
    }
}
