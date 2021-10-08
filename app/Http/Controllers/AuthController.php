<?php

namespace App\Http\Controllers;

use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|confirmed'
        ]);
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => md5($request->password)
        ]);
        $credentials = ['email' => $request->email, 'password' => $request->password];
        if (!Auth::attempt($credentials)) { return response()->json(['message' => 'Bilgiləri doğru girin!'], 401); }
        $user = $request->user();
        $tokenResult = $user->createToken('Personal Access');
        $token = $tokenResult->token;
        if ($request->remember_me) { $token->expires_at = Carbon::now()->addWeek(); }
        $token->save();
        return response()->json([
            'success' => true,
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'access_token' => $tokenResult->accessToken,
            'token_type' => 'Bearer',
            'expires_at' => Carbon::parse($tokenResult->token->expires_at)->toDateString()
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
            'remember_me'=>'boolean'
        ]);
        $credentials = request(['email', 'password']);
        if (!Auth::attempt($credentials)) { return response()->json(['message' => 'İstifadəçi Adı və ya Şifrə yanlışdır!'], 401); }
        $user = $request->user();
        $tokenResult = $user->createToken('Personal Access Token');
        $token = $tokenResult->token;
        if ($request->remember_me) { $token->expires_at = Carbon::now()->addWeek(); }
        $token->save();
        return response()->json([
            'success' => true,
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'access_token' => $tokenResult->accessToken,
            'token_type' => 'Bearer',
            'expires_at' => Carbon::parse($tokenResult->token->expires_at)->toDateString()
        ], 201);
    }

    public function logout(Request $request)
    {
        $request->user()->token()->revoke();
        return response()->json([
            'message' => 'Çıxış edildi'
        ]);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    public function authenticate(Request $request)
    {
        $user = [];
        if (Auth::check()) {
            $user = $request->user();
        }
        return response()->json([
            'user' => $user,
            'isLoggedIn' => Auth::check()
        ]);
    }
}
