<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureRoleIs
{
    public function handle(Request $request, Closure $next, ...$roles)
    {
        $user = $request->user();
        if (!$user || !in_array($user->role, $roles)) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }
        return $next($request);
    }
} 