<?php

namespace App\Http\Controllers;

use App\Http\Resources\TaskResource;
use App\Models\Task;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $totalPendingTasks = Task::query()->where('status', 'pending')->count();

        $myPendingTasks = Task::query()->where('status', 'pending')->where('assigned_user_id', $user->id)->count();

        $totalInProgressTasks = Task::query()->where('status', 'in_progress')->count();

        $myInProgressTasks = Task::query()->where('status', 'in_progress')->where('assigned_user_id', $user->id)->count();

        $totalCompletedTasks = Task::query()->where('status', 'completed')->count();

        $myCompletedTasks = Task::query()->where('status', 'completed')->where('assigned_user_id', $user->id)->count();

        $activeTasks = Task::query()->whereNot('status', 'completed')->where('assigned_user_id', $user->id)->orderBy('due_date','desc')->limit(10)->get();

        $activeTasks = TaskResource::collection($activeTasks);

        return Inertia('Dashboard', compact(
            'totalInProgressTasks',
            'myInProgressTasks',
            'totalCompletedTasks',
            'myCompletedTasks',
            'totalPendingTasks',
            'myPendingTasks',
            'activeTasks'
        ));
    }
}
