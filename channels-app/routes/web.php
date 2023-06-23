<?php

use App\Http\Controllers\channelsController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [channelsController::class, 'index'])->name('index');

Route::get('/kanal/dodaj', [channelsController::class, 'create'])->name('dodaj');

Route::get('/kanal/edytuj/{id}', [channelsController::class, 'edit'])->name('edytuj');

Route::post('/kanal/zapisz', [channelsController::class, 'store'])->name('zapisz');

Route::put('/kanal/zmien/{id}', [channelsController::class, 'update'])->name('zmien');

Route::delete('/kanal/usun/{id}', [channelsController::class, 'delete'])->name('usun');


