<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    protected $fillable = ['message', 'phone', 'name', 'email', 'subject', 'status'];
}
