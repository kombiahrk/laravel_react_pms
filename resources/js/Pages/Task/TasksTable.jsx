import React from 'react';
import TableHeading from "@/Components/TableHeading";
import { TASK_STATUS_CLASS_MAP, TASK_STATUS_TEXT_MAP } from "@/constants";
import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import { Link, router } from "@inertiajs/react";

const TasksTable = ({ tasks, queryParams = null, hideProjectColumn = false }) => {
    queryParams = queryParams || {}
    const searchFeildChanged = (name, value) => {
        if (value) {
            queryParams[name] = value
        }
        else {
            delete queryParams[name]
        }
        router.get(route('task.index'), queryParams);
    };

    const onKeyPress = (name, e) => {
        if (e.key !== 'Enter') return;

        searchFeildChanged(name, e.target.value);
    };

    const sortChanged = (name) => {
        if (name === queryParams.sort_feild) {
            if (queryParams.sort_direction === 'asc') {
                queryParams.sort_direction = 'desc';
            } else {
                queryParams.sort_direction = 'asc';
            }
        } else {
            queryParams.sort_feild = name;
            queryParams.sort_direction = 'asc';
        }
        router.get(route('task.index'), queryParams);
    };

    const deleteTask = (task) => {
        if (!window.confirm('Are you sure want to delete the task?')) {
            return;
        }
        router.delete(route('task.destroy', task.id))
    };

    return (
        <>
            <div className="overflow-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                        <tr className="text-nowrap">
                            <TableHeading
                                name="id"
                                sort_feild={queryParams.sort_feild}
                                sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}
                            >
                                ID
                            </TableHeading>
                            <th className="px-3 py-3">Image</th>
                            {!hideProjectColumn && (
                                <th className="px-3 py-3">Project Name</th>
                            )}
                            <TableHeading
                                name="name"
                                sort_feild={queryParams.sort_feild}
                                sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}
                            >
                                Name
                            </TableHeading>
                            <TableHeading
                                name="status"
                                sort_feild={queryParams.sort_feild}
                                sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}
                            >
                                Status
                            </TableHeading>
                            <TableHeading
                                name="created_at"
                                sort_feild={queryParams.sort_feild}
                                sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}
                            >
                                Created Date
                            </TableHeading>
                            <TableHeading
                                name="due_date"
                                sort_feild={queryParams.sort_feild}
                                sort_direction={queryParams.sort_direction}
                                sortChanged={sortChanged}
                            >
                                Due Date
                            </TableHeading>
                            <th className="px-3 py-3">Created By</th>
                            <th className="px-3 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                        <tr className="text-nowrap">
                            <th className="px-3 py-3"></th>
                            <th className="px-3 py-3"></th>
                            {!hideProjectColumn && (
                                <th className="px-3 py-3">
                                    <TextInput
                                        defaultValue={queryParams.name}
                                        className="w-full"
                                        placeholder="Project Name"
                                        onBlur={(e) => searchFeildChanged('project_name', e.target.value)}
                                        onKeyPress={(e) => onKeyPress('project_name', e)}
                                    />
                                </th>
                            )}
                            <th className="px-3 py-3">
                                <TextInput
                                    defaultValue={queryParams.name}
                                    className="w-full"
                                    placeholder="Task Name"
                                    onBlur={(e) => searchFeildChanged('task_name', e.target.value)}
                                    onKeyPress={(e) => onKeyPress('task_name', e)}
                                />
                            </th>
                            <th className="px-3 py-3 ">
                                <SelectInput
                                    defaultValue={queryParams.status}
                                    className="w-full"
                                    onChange={(e) => searchFeildChanged('status', e.target.value)}
                                >
                                    <option value="">Select Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </SelectInput>
                            </th>
                            <th className="px-3 py-3"></th>
                            <th className="px-3 py-3"></th>
                            <th className="px-3 py-3"></th>
                            <th className="px-3 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.data.map(task => (
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={task.id}>
                                <th className="px-3 py-2">{task.id}</th>
                                <td className="px-3 py-2"><img src={task.image_path} style={{ width: 60 }} alt="image" /></td>
                                {!hideProjectColumn && (
                                    <td className="px-3 py-2 text-nowrap">{task.project.name}</td>
                                )}
                                <td className="px-3 py-2 text-nowrap">{task.name}</td>
                                <td className="px-3 py-2 text-nowrap">
                                    <span className={"px-2 py-1 rounded text-white " + TASK_STATUS_CLASS_MAP[task.status]}>
                                        {TASK_STATUS_TEXT_MAP[task.status]}
                                    </span>
                                </td>
                                <td className="px-3 py-2 text-nowrap">{task.created_at}</td>
                                <td className="px-3 py-2 text-nowrap">{task.due_date}</td>
                                <td className="px-3 py-2">{task.createdBy.name}</td>
                                <td className="px-3 py-2 text-nowrap">
                                    <Link href={route('task.edit', task.id)}
                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1">
                                        Edit
                                    </Link>
                                    <button onClick={(e) => deleteTask(task)}
                                        className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination links={tasks.meta.links} />
        </>
    )
}

export default TasksTable
