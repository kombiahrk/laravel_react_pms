<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\Project;
use Illuminate\Support\Str;
use App\Http\Resources\TaskResource;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreTaskRequest;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\UserResource;
use App\Models\User;

class TaskController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Task::query()->with('project');

        $sortField = request("sort_feild", "created_at");
        $sortDirection = request('sort_direction', "desc");

        if (request("project_name")) {
            $query->whereHas('project', function ($query) {
                $query->where("name", "like", "%" . request("project_name") . "%");
            });
        }

        if (request("task_name")) {
            $query->where("name", "like", "%" . request("task_name") . "%");
        }

        if (request("status")) {
            $query->where("status", request("status"));
        }

        // Retrieve tasks data and paginate the results
        $tasks = $query->orderBy($sortField, $sortDirection)->paginate(10);

        // Return the "Task/Index" view along with the tasks data collection
        return inertia("Task/Index", [
            "tasks" => TaskResource::collection($tasks),
            "queryParams" => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $projects = Project::query()->orderBy('name', 'asc')->get();
        $users = User::all();
        return inertia("Task/Create", [
            'projects' => ProjectResource::collection($projects),
            'users' => UserResource::collection($users),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTaskRequest $request)
    {
        $data = $request->validated();
        $image = $data['image'] ?? null;
        $data['created_by'] = Auth::id();
        $data['updated_by'] = Auth::id();
        if ($image) {
            $data['image_path'] = $image->store('task/' . Str::random(), 'public');
        }
        Task::create($data);

        return to_route('task.index')->with("success", "Task created successfully.");
    }

    /**
     * Display the specified resource.
     */
    public function show(Task $task)
    {
        return inertia("Task/Show", [
            "task" => new TaskResource($task),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        $projects = Project::query()->orderBy('name', 'asc')->get();
        $users = User::all();
        return inertia("Task/Edit", [
            "task" => new TaskResource($task),
            'projects' => ProjectResource::collection($projects),
            'users' => UserResource::collection($users),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        $data = $request->validated();
        $image = $data['image'] ?? null;
        $data['updated_by'] = Auth::id();
        if ($image) {
            if ($task->image_path) {
                Storage::disk('public')->deleteDirectory(dirname($task->image_path));
            }
            $data['image_path'] = $image->store('task/' . Str::random(), 'public');
        }
        $task->update($data);
        return to_route('task.index')->with("success", "Task " . $task->name . " updated successfully.");
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Task $task)
    {
        $taskName = $task->name;
        if ($task->image_path) {
            Storage::disk('public')->deleteDirectory(dirname($task->image_path));
        }
        $task->delete();
        return to_route('task.index')->with("success", "Task " . $taskName . " deleted successfully.");
    }

    public function myTasks()
    {
        $user = auth()->user();

        $query = Task::query()->with('project')->where('assigned_user_id', $user->id);

        $sortField = request("sort_feild", "created_at");
        $sortDirection = request('sort_direction', "desc");

        if (request("project_name")) {
            $query->whereHas('project', function ($query) {
                $query->where("name", "like", "%" . request("project_name") . "%");
            });
        }

        if (request("task_name")) {
            $query->where("name", "like", "%" . request("task_name") . "%");
        }

        if (request("status")) {
            $query->where("status", request("status"));
        }

        // Retrieve tasks data and paginate the results
        $tasks = $query->orderBy($sortField, $sortDirection)->paginate(10);

        // Return the "Task/Index" view along with the tasks data collection
        return inertia("Task/Index", [
            "tasks" => TaskResource::collection($tasks),
            "queryParams" => request()->query() ?: null,
            'success' => session('success'),
        ]);
    }
}
