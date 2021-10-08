<?php

use Illuminate\Support\Facades\Route;

Route::view('/{path?}', 'index')->where('path', '.+');
