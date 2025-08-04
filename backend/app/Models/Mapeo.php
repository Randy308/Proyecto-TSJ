<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property int $resolution_id
 * @property int $external_id
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read \App\Models\Resolution|null $resolution
 * @mixin \Eloquent
 */
class Mapeo extends Model
{
    use HasFactory;

    protected $fillable = [
        'external_id',
        'resolution_id',
    ];

    protected $hidden = [
        'created_at',
        'updated_at',
    ];

    public function resolution()
    {
        return $this->belongsTo(Resolution::class);
    }
}
