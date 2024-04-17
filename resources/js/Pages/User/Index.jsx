import Pagination from "@/Components/Pagination";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import TableHeading from "@/Components/TableHeading";

export default function Index({ auth, users, queryParams = null, success }) {
    queryParams = queryParams || {}
    const searchFeildChanged = (name, value) => {
        if (value) {
            queryParams[name] = value
        }
        else {
            delete queryParams[name]
        }
        router.get(route('user.index'), queryParams);
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
        router.get(route('user.index'), queryParams);
    };

    const deleteUser = (user) => {
        if (!window.confirm('Are you sure want to delete the user?')) {
            return;
        }
        router.delete(route('user.destroy', user.id))
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Users</h2>
                    <Link className="bg-emerald-500 text-white px-3 py-1 rounded hover:bg-emerald-600" href={route('user.create')}> Add New</Link>
                </div>
            }
        >
            <Head title="Users" />

            <div className="py-12">
                <div className="max-w-9xl mx-auto sm:px-6 lg:px-8">
                    {success && (
                        <div className="bg-emerald-500 py-2 px-4 text-white rounded mb-4">
                            {success}
                        </div>
                    )}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
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
                                            <TableHeading
                                                name="name"
                                                sort_feild={queryParams.sort_feild}
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                Name
                                            </TableHeading>
                                            <TableHeading
                                                name="email"
                                                sort_feild={queryParams.sort_feild}
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                Email
                                            </TableHeading>
                                            <TableHeading
                                                name="created_at"
                                                sort_feild={queryParams.sort_feild}
                                                sort_direction={queryParams.sort_direction}
                                                sortChanged={sortChanged}
                                            >
                                                Created Date
                                            </TableHeading>
                                            <th className="px-3 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                        <tr className="text-nowrap">
                                            <th className="px-3 py-3"></th>
                                            <th className="px-3 py-3">
                                                <TextInput
                                                    defaultValue={queryParams.name}
                                                    className="w-full"
                                                    placeholder="User Name"
                                                    onBlur={(e) => searchFeildChanged('name', e.target.value)}
                                                    onKeyPress={(e) => onKeyPress('name', e)}
                                                />
                                            </th>
                                            <th className="px-3 py-3">
                                                <TextInput
                                                    defaultValue={queryParams.email}
                                                    className="w-full"
                                                    placeholder="User Email"
                                                    onBlur={(e) => searchFeildChanged('email', e.target.value)}
                                                    onKeyPress={(e) => onKeyPress('email', e)}
                                                />
                                            </th>
                                            <th className="px-3 py-3"></th>
                                            <th className="px-3 py-3"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.data.map(user => (
                                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700" key={user.id}>
                                                <th className="px-3 py-2 text-nowrap">{user.id}</th>
                                                <td className="px-3 py-2 text-nowrap">{user.name}</td>
                                                <td className="px-3 py-2 text-nowrap">{user.email}</td>
                                                <td className="px-3 py-2 text-nowrap">{user.created_at}</td>
                                                <td className="px-3 py-2 text-nowrap">
                                                    <Link href={route('user.edit', user.id)}
                                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1">
                                                        Edit
                                                    </Link>
                                                    <button onClick={(e) => deleteUser(user)}
                                                        className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1">
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination links={users.meta.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
