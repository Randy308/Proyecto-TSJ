<?php

use App\Http\Controllers\api\ExcelController;
use App\Http\Controllers\Api\TemaController;
use App\Http\Controllers\TemasController;
use Illuminate\Support\Facades\Route;
use Spatie\Permission\Models\Role;

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
Route::get('/', function () {
    return view('prueba');
});
Route::post('/excel/upload', [ExcelController::class, 'upload'])->name('excel.upload');


Route::post('/excel/upload-jurisprudencia', [ExcelController::class, 'upload_jurisprudencia'])->name('excel.upload.jurisprudencia');
