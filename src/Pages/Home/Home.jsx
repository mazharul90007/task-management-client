import { useForm } from "react-hook-form";
import SocialLogin from "../../Components/SocialLogin/SocialLogin";
import useAuth from "../../Hooks/useAuth";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Home = () => {
    const { user, setUser, logOut } = useAuth();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const axiosPublic = useAxiosPublic();
    const [editTask, setEditTask] = useState({});
    const [stores, setStores] = useState([]);

    const handleLogOut = () => {
        logOut()
            .then(() => {
                setUser(null);
            })
            .catch(error => {
                console.log(error);
            });
    };

    // Get data based on email
    const { data: allTasks = [], refetch } = useQuery({
        queryKey: ["todoTasks", user?.email],
        queryFn: async () => {
            if (!user?.email) return [];
            const res = await axiosPublic.get('/tasks', {
                params: { email: user.email }
            });
            return res.data;
        },
        enabled: !!user?.email,
    });

    useEffect(() => {
        setStores(allTasks);
    }, [allTasks]);

    const todoTasks = stores.filter(task => task.category === 'todo');
    const inProgressTasks = stores.filter(task => task.category === 'inProgress');
    const doneTasks = stores.filter(task => task.category === 'done');

    const openModal = () => {
        document.getElementById('addTask')?.showModal();
    };

    const closeModal = () => {
        setEditTask({}); // Reset editTask state
        reset(); // Reset the form
        document.getElementById('addTask')?.close();
    };

    const handleEditButton = (task) => {
        setEditTask(task);
        openModal();
    };

    const handleEdit = async (data) => {
        const updatedTask = {
            title: data.title,
            description: data.description,
        };

        try {
            const taskRes = await axiosPublic.patch(`/tasks/${editTask._id}`, updatedTask);
            if (taskRes.data.modifiedCount > 0) {
                toast.success("Task Updated Successfully");
                refetch(); // Refetch tasks to update the UI
                closeModal(); // Close the modal
            } else {
                toast.error("Failed to Update Task");
            }
        } catch (error) {
            console.error("Error updating task:", error);
            toast.error("Failed to update task.");
        }
    };

    // Post a new task
    const handleTaskSubmit = async (data) => {
        try {
            const taskInfo = {
                title: data.title,
                description: data.description,
                category: data.category,
                postedTime: Date.now(),
                email: user.email
            };

            const taskRes = await axiosPublic.post('/tasks', taskInfo);
            if (taskRes.data.insertedId) {
                toast.success("Task Submission Successful");
                refetch(); // Refetch tasks to update the UI
                reset(); // Reset the form
            } else {
                toast.error("Something went wrong!");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to submit task.");
        }
    };

    // Delete a task
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosPublic.delete(`/tasks/${id}`)
                    .then(res => {
                        const data = res.data;
                        if (data.deletedCount > 0) {
                            refetch();
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your Review has been deleted.",
                                icon: "success"
                            });
                        }
                    });
            }
        });
    };

    // ------------Handle Drag and Drop-------------------

    const handleDragDrop = async (results) => {
        const { source, destination } = results;

        console.log("Source:", source);
        console.log("Destination:", destination);

        // If there's no destination or the task is dropped in the same position, do nothing
        if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) return;

        const reorderedStores = [...stores];

        // Find the task being moved
        const task = reorderedStores.find((task) => task._id === results.draggableId);

        if (source.droppableId === destination.droppableId) {
            // Reorder tasks within the same column
            const filteredTasks = reorderedStores.filter((task) => task.category === source.droppableId);
            const [removedTask] = filteredTasks.splice(source.index, 1);
            filteredTasks.splice(destination.index, 0, removedTask);

            // Update the stores array with the new order
            const updatedStores = reorderedStores.map((task) => {
                if (task.category === source.droppableId) {
                    return filteredTasks.shift();
                }
                return task;
            });

            setStores(updatedStores);
        } else {
            // Move task to a different column
            task.category = destination.droppableId; // Update the task's category

            // Update the stores array
            const updatedStores = reorderedStores.map((t) =>
                t._id === task._id ? { ...t, category: destination.droppableId } : t
            );
            setStores(updatedStores);

            // Update the task in the database
            try {
                await axiosPublic.patch(`/tasks/category/${task._id}`, { category: destination.droppableId });
                refetch(); // Refetch tasks to ensure the UI is up-to-date
            } catch (error) {
                console.error("Failed to update task category:", error);
            }
        }
    };

    return (
        <div>
            <div className="flex gap-2 items-center justify-end">
                <SocialLogin></SocialLogin>
                <button onClick={handleLogOut} className="btn btn-success">LogOut</button>
            </div>
            <div className="text-center">
                <h3 className="text-3xl font-semibold text-teal-600">Your Daily Task</h3>
            </div>

            {/* Create a Task */}
            <div className="w-11/12 mx-auto">
                <form onSubmit={handleSubmit(handleTaskSubmit)} className="w-full flex items-center gap-2">
                    {/* Title */}
                    <div className="flex items-center gap-1">
                        <label className="block">Title</label>
                        <input
                            type="text"
                            placeholder="Enter title"
                            {...register('title', {
                                required: "Title is required",
                                maxLength: { value: 50, message: "Title cannot exceed 50 characters" }
                            })}
                            className="input input-bordered w-full"
                        />
                        {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                    </div>

                    {/* Description */}
                    <div className="flex items-center gap-1">
                        <label className="block">Description</label>
                        <input
                            type="text"
                            placeholder="Enter description"
                            {...register('description', {
                                required: "Description is required",
                                maxLength: { value: 200, message: "Description cannot exceed 200 characters" }
                            })}
                            className="input input-bordered w-full"
                        />
                        {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                    </div>

                    {/* Category */}
                    <div className="flex items-center gap-1">
                        <label className="block">Category</label>
                        <select defaultValue='default' {...register('category', { required: true })} className="select select-bordered w-full">
                            <option disabled value="default">Category</option>
                            <option value="todo">To Do</option>
                            <option value="inProgress">In Progress</option>
                            <option value="done">Done</option>
                        </select>
                    </div>

                    <button className="btn btn-sm border border-green-500 text-green-700">Post</button>
                </form>
            </div>

            {/* Display Card Section */}
            <DragDropContext onDragEnd={handleDragDrop}>
                <div className="w-11/12 mx-auto">
                    {user?.email ? (
                        <div className="grid md:grid-cols-3 gap-2 mt-16 h-full">
                            {/* To Do Column */}
                            <Droppable droppableId="todo" type="group">
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps} className="border border-red-400 h-full">
                                        <h2 className="text-center text-2xl font-semibold p-2 border-b">Task to Do</h2>
                                        {todoTasks.map((task, index) => (
                                            <Draggable key={task._id} draggableId={task._id} index={index}>
                                                {(provided) => (
                                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="p-2 border mb-1 shadow border-gray-200">
                                                        <div className="flex items-center justify-end gap-0.5">
                                                            <button onClick={() => handleDelete(task._id)} className="border p-1 rounded bg-red-50 text-red-500 cursor-pointer">
                                                                <MdDelete />
                                                            </button>
                                                            <button onClick={() => handleEditButton(task)} className="border p-1 rounded bg-green-50 text-green-500 cursor-pointer">
                                                                <FaRegEdit />
                                                            </button>
                                                        </div>
                                                        <h2 className="text-lg font-semibold">{task.title}</h2>
                                                        <p className="text-sm text-gray-500">{task.description}</p>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>

                            {/* In Progress Column */}
                            <Droppable droppableId="inProgress" type="group">
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps} className="border border-yellow-400 h-full">
                                        <h2 className="text-center text-2xl font-semibold p-2 border-b">Task In Progress</h2>
                                        {inProgressTasks.map((task, index) => (
                                            <Draggable key={task._id} draggableId={task._id} index={index}>
                                                {(provided) => (
                                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="p-2 border mb-1 shadow border-gray-200">
                                                        <div className="flex items-center justify-end gap-0.5">
                                                            <button onClick={() => handleDelete(task._id)} className="border p-1 rounded bg-red-50 text-red-500 cursor-pointer">
                                                                <MdDelete />
                                                            </button>
                                                            <button onClick={() => handleEditButton(task)} className="border p-1 rounded bg-green-50 text-green-500 cursor-pointer">
                                                                <FaRegEdit />
                                                            </button>
                                                        </div>
                                                        <h2 className="text-lg font-semibold">{task.title}</h2>
                                                        <p className="text-sm text-gray-500">{task.description}</p>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>

                            {/* Done Column */}
                            <Droppable droppableId="done" type="group">
                                {(provided) => (
                                    <div ref={provided.innerRef} {...provided.droppableProps} className="border border-green-400 h-full">
                                        <h2 className="text-center text-2xl font-semibold p-2 border-b">Task Done</h2>
                                        {doneTasks.map((task, index) => (
                                            <Draggable key={task._id} draggableId={task._id} index={index}>
                                                {(provided) => (
                                                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="p-2 border mb-1 shadow border-gray-200">
                                                        <div className="flex items-center justify-end gap-0.5">
                                                            <button onClick={() => handleDelete(task._id)} className="border p-1 rounded bg-red-50 text-red-500 cursor-pointer">
                                                                <MdDelete />
                                                            </button>
                                                            <button onClick={() => handleEditButton(task)} className="border p-1 rounded bg-green-50 text-green-500 cursor-pointer">
                                                                <FaRegEdit />
                                                            </button>
                                                        </div>
                                                        <h2 className="text-lg font-semibold">{task.title}</h2>
                                                        <p className="text-sm text-gray-500">{task.description}</p>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ) : (
                        <div></div>
                    )}
                </div>
            </DragDropContext>

            {/* Show Modal */}
            <dialog id="addTask" className="modal" aria-modal="true">
                <div className="modal-box">
                    <h3 className="font-bold text-xl text-center">Edit Your Task</h3>
                    <form onSubmit={handleSubmit(handleEdit)} className="w-full space-y-4">
                        {/* Title Field */}
                        <div>
                            <label className="block">Title</label>
                            <input
                                type="text"
                                placeholder="Enter title"
                                defaultValue={editTask.title}
                                {...register('title', {
                                    required: "Title is required",
                                    maxLength: { value: 50, message: "Title cannot exceed 50 characters" }
                                })}
                                className="input input-bordered w-full"
                            />
                            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
                        </div>

                        {/* Description Field */}
                        <div>
                            <label className="block">Description</label>
                            <textarea
                                placeholder="Enter description"
                                defaultValue={editTask.description}
                                {...register('description', {
                                    required: "Description is required",
                                    maxLength: { value: 200, message: "Description cannot exceed 200 characters" }
                                })}
                                className="textarea w-full"
                            />
                            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                        </div>

                        <button type="submit" className="btn btn-sm border border-green-500 mt-1 text-green-700">Update Task</button>
                    </form>
                    <div className="flex justify-end">
                        <button onClick={closeModal} className="btn btn-sm border border-red-600 text-primary">X</button>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default Home;