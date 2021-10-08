<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::group(['prefix' => 'auth'], function () {
    Route::post('login', [\App\Http\Controllers\AuthController::class, 'login']);
    Route::post('register', [\App\Http\Controllers\AuthController::class, 'register']);
});

Route::group(['middleware' => ['auth:api']], function() {
    Route::post('/logout', [\App\Http\Controllers\AuthController::class, 'logout']);
    Route::post('/authenticate', [\App\Http\Controllers\AuthController::class, 'authenticate']);
    Route::resource('/product', \App\Http\Controllers\Api\Product\ProductController::class);
});
