<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int|null $user_id
 * @property int|null $estilo_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Estilo|null $estilo
 * @property-read \App\Models\User|null $user
 * @mixin \Eloquent
 */
class UserEstilo extends Model
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
        return $this->belongsTo(Estilo::class);
    }
}
