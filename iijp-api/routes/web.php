<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

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

//$role = Role::create(['name'=> 'admin']);
//$role = Role::create(['name'=> 'user']);



Route::get('/{any}', function () {
    return view('index');
})->where('any', '.*');
