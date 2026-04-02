<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DemoController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProjectController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::controller(AuthController::class)->group(function () {
    Route::get('/users', 'users');
    Route::get('/users/{user}', 'user');
    Route::post('/register', 'register');
    Route::post('/login', 'login');
    Route::post('/logout', 'logout')->middleware('auth:sanctum');
    Route::post('/me', 'me')->middleware('auth:sanctum');
});

Route::controller(OrderController::class)->prefix('orders')->group(function () {
    Route::get('', 'index');
    Route::get('/{order}', 'show');
    Route::post('', 'store')->middleware('auth:sanctum');
    Route::patch('/{order}', 'update')->middleware('auth:sanctum');
    Route::delete('/{order}', 'destroy')->middleware('auth:sanctum');
});

Route::controller(DemoController::class)->prefix('demos')->group(function () {
    Route::get('', 'index');
    Route::get('/{demo}', 'show');
    Route::post('', 'store')->middleware('auth:sanctum');
    Route::patch('/{demo}', 'update')->middleware('auth:sanctum');
    Route::delete('/{demo}', 'destroy')->middleware('auth:sanctum');
});
Route::post('/upload', [DemoController::class, 'upload'])->middleware('auth:sanctum');

Route::controller(ProjectController::class)->prefix('projects')->group(function () {
    Route::get('', 'index');
    Route::get('/{project}', 'show');
    Route::post('', 'store')->middleware('auth:sanctum');
    Route::patch('/{project}', 'update')->middleware('auth:sanctum');
    Route::delete('/{project}', 'destroy')->middleware('auth:sanctum');
});

Route::post('/upload/audio', [ProjectController::class, 'uploadAudio']);
Route::post('/upload/video',  [ProjectController::class, 'uploadVideo'])->middleware('auth:sanctum');
Route::post('/upload/thumbnail',  [ProjectController::class, 'uploadThumbnail'])->middleware('auth:sanctum');


Route::controller(ContactController::class)->prefix('/contacts')->group(function () {
    Route::get('', 'index');
    Route::post('', 'store');
    Route::get('/{contact}', 'show');
    Route::patch('/{contact}', 'update')->middleware(['auth:sanctum']);
    Route::delete('/{contact}', 'destroy')->middleware(['auth:sanctum']);
});
