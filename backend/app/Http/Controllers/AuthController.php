<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validate = $request->validate([
            'name' => 'required|string|max:110',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
            'phone' => 'required|string'
        ]);

        $user = User::create($validate);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['data' => $user, 'token' => $token], 201);
    }

    public function login(Request $request)
    {
        $validate = $request->validate([
            'email' => 'required|email|exists:users,email',
            'password' => 'required|string|min:8'
        ]);

        $user = User::query()->where('email', $request->email)->first();

        if (!Auth::attempt($validate)) {
            throw ValidationException::withMessages(['Wrong informations']);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['data' => $user, 'token' => $token, 'role' => $user->role], 201);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Logged out Successfully.'], 201);
    }

    public function me(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'User Not Found!'], 404);
        }

        return response()->json(['data' => $user], 200);
    }

    public function users()
    {
        $users = User::with('orders')->where('role', 'user')->get();
        return response()->json(['data' => $users], 200);
    }

    public function user(User $user)
    {
        $user = User::with('orders')->where('id', $user->id)->first();

        if (!$user) {
            return response()->json(['message' => 'User Not Found!'], 404);
        }

        return response()->json(['data' => $user], 200);
    }
}
