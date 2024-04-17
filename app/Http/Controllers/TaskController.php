<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Support\Str;
use App\Http\Resources\TaskResource;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StoreTaskRequest;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\UpdateTaskRequest;

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
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia("Task/Create");
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
        // $query = $task->tasks();

        // $sortField = request("sort_feild", "created_at");
        // $sortDirection = request('sort_direction', "desc");

        // if (request("name")) {
        //     $query->where("name", "like", "%" . request("name") . "%");
        // }

        // if (request("status")) {
        //     $query->where("status", request("status"));
        // }

        // $tasks = $query->orderBy($sortField, $sortDirection)->paginate(10);

        // return inertia("Task/Show", [
        //     "task" => new TaskResource($task),
        //     "tasks" => TaskResource::collection($tasks),
        //     "queryParams" => request()->query() ?: null,
        // ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Task $task)
    {
        return inertia("Task/Edit", [
            "task" => new TaskResource($task),
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
}
