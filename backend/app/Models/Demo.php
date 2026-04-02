<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Demo extends Model
{
    protected $fillable = ['title', 'category', 'duration', 'audio'];

    public function getAudioUrlAttribute()
    {
        if ($this->audio && !filter_var($this->audio, FILTER_VALIDATE_URL)) {
            return asset('storage/' . $this->audio);
        }
        return $this->audio;
    }
}
