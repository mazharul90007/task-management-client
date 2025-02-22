import { useForm } from "react-hook-form";
import SocialLogin from "../../Components/SocialLogin/SocialLogin";
import useAuth from "../../Hooks/useAuth";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Home = () => {
    const { user } = useAuth();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const axiosPublic = useAxiosPublic();
    const [editTask, setEditTask] = useState({});
    const [stores, setStores] = useState([]);



    // Get data based on email
    const { refetch } = useQuery({
        queryKey: ["allTasks", user?.email],
        queryFn: async () => {
            if (!user?.email) return [];
            const res = await axiosPublic.get('/tasks', {
                params: { email: user?.email }
            });
            setStores(res.data);
            return res.data;

        },
        enabled: !!user?.email,
    });

    // useEffect(() => {
    //     setStores(allTasks);
    // }, [allTasks]);
    // setStores(allTasks);

    const todoTasks = stores?.filter(task => task.category === 'todo');
    const inProgressTasks = stores?.filter(task => task.category === 'inProgress');
    const doneTasks = stores?.filter(task => task.category === 'done');

    const openModal = () => {
        document.getElementById('addTask')?.showModal();
    };

    const closeModal = () => {
        setEditTask({}); // Reset editTask state
        reset(); // Reset the form
        document.getElementById('addTask')?.close();
    };

    const handleEditButton = (task) => {
        console.log(task)
        setEditTask(task);
        openModal();
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        const form = e.target;
        const title = form.title.value;
        const description = form.description.value;
        const updatedTask = {
            title: title,
            description: description
        };
        console.log(updatedTask)

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
        // console.log(data)
        try {
            const taskInfo = {
                title: data.title,
                description: data.description,
                category: data.category,
                postedTime: Date.now(),
                email: user.email
            };

            // console.log("Form Data:", taskInfo); // Debugging

            const taskRes = await axiosPublic.post('/tasks', taskInfo);
            // console.log("Backend Response:", taskRes); // Debugging

            if (taskRes.data.insertedId) {
                toast.success("Task Submission Successful");
                refetch().then(() => {
                    reset();
                });

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
        const { source, destination, draggableId } = results;
        // console.log(results)


        if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) return;

        // Clone stores to avoid modifying state directly
        const reorderedStores = [...stores];

        // Find the task being moved
        const task = reorderedStores.find((task) => task._id === draggableId);
        if (!task) return;

        if (source.droppableId === destination.droppableId) {
            // Reorder tasks within the same column
            const filteredTasks = reorderedStores.filter((t) => t.category === source.droppableId);
            const [removedTask] = filteredTasks.splice(source.index, 1);
            filteredTasks.splice(destination.index, 0, removedTask);

            // Create a new stores array
            const updatedStores = reorderedStores.map((t) =>
                t.category === source.droppableId ? filteredTasks.shift() : t
            );

            setStores(updatedStores);
        } else {
            // Move task to a different column
            const updatedTask = { ...task, category: destination.droppableId };
            const updatedStores = reorderedStores.map((t) =>
                t._id === task._id ? updatedTask : t
            );

            setStores(updatedStores);

            // Update the task in the database
            try {
                await axiosPublic.patch(`/tasks/category/${task._id}`, { category: destination.droppableId });
                refetch();
            } catch (error) {
                console.error("Failed to update task category:", error);
            }
        }
    };


    return (
        <div>
            <DragDropContext onDragEnd={handleDragDrop}>
                {/* Display Card Section */}
                <div className="w-11/12 mx-auto">

                    {user?.email ?

                        <div className="mt-16">
                            {/* Description */}
                            <div>
                                <div className="text-center mb-4">
                                    <h3 className="text-3xl font-semibold text-teal-600">Your Daily Task</h3>
                                </div>

                                {/* Create a Task */}
                                <div className="">
                                    <form onSubmit={handleSubmit(handleTaskSubmit)} className="w-full flex flex-col md:flex-row items-start md:items-center gap-2">
                                        {/* Title */}
                                        <div className="flex items-center gap-1 w-full">
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
                                        <div className="flex items-center gap-1 w-full">
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
                                        <div className="flex items-center gap-1 w-full">
                                            <label className="block">Category</label>
                                            <select defaultValue='default' {...register('category', { required: true })} className="select select-bordered w-full">
                                                <option disabled value="default">Category</option>
                                                <option value="todo">To Do</option>
                                                <option value="inProgress">In Progress</option>
                                                <option value="done">Done</option>
                                            </select>
                                        </div>

                                        <button className="btn btn-sm border border-green-500 text-green-700">Add Task</button>
                                    </form>
                                </div>
                            </div>

                            <div>
                                {/* Task Container */}
                                <div className="">

                                    <div className="grid md:grid-cols-3 gap-2 mt-16 h-full">
                                        {/* To Do Column */}
                                        <Droppable droppableId="todo" type="group">
                                            {(provided) => (
                                                <div ref={provided.innerRef} {...provided.droppableProps} className="border border-blue-300 h-full bg-blue-100 p-2">
                                                    <h2 className="text-center text-2xl font-semibold p-2 border-b mb-2 text-teal-600">Task to Do</h2>
                                                    {todoTasks.map((task, index) => (
                                                        <Draggable key={task._id} draggableId={task._id} index={index}>
                                                            {(provided) => (
                                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="p-2 border mb-1 shadow border-gray-200 bg-blue-50 rounded-md">
                                                                    <div className="flex items-center justify-end gap-0.5">
                                                                        <button onClick={() => handleDelete(task._id)} className="border p-1 rounded bg-red-50 text-red-500 cursor-pointer">
                                                                            <MdDelete />
                                                                        </button>
                                                                        <button onClick={() => handleEditButton(task)} className="border p-1 rounded bg-green-50 text-green-500 cursor-pointer">
                                                                            <FaRegEdit />
                                                                        </button>
                                                                    </div>
                                                                    <div>
                                                                        <h2 className="text-lg font-semibold">{task.title}</h2>
                                                                        <p className="text-sm text-gray-500 mb-3">{task.description}</p>
                                                                        <p className=" text-xs text-gray-400 font-semibold mt-auto italic">Uploaded: {new Date(task.postedTime).toLocaleString()}</p>
                                                                    </div>
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
                                                <div ref={provided.innerRef} {...provided.droppableProps} className="border border-blue-300 bg-blue-100 h-full shadow p-2">
                                                    <h2 className="text-center text-2xl font-semibold p-2 border-b mb-2 text-teal-600">Task In Progress</h2>
                                                    {inProgressTasks.map((task, index) => (
                                                        <Draggable key={task._id} draggableId={task._id} index={index}>
                                                            {(provided) => (
                                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="p-2 border mb-1 shadow border-gray-200 bg-blue-50 rounded-md">
                                                                    <div className="flex items-center justify-end gap-0.5">
                                                                        <button onClick={() => handleDelete(task._id)} className="border p-1 rounded bg-red-50 text-red-500 cursor-pointer">
                                                                            <MdDelete />
                                                                        </button>
                                                                        <button onClick={() => handleEditButton(task)} className="border p-1 rounded bg-green-50 text-green-500 cursor-pointer">
                                                                            <FaRegEdit />
                                                                        </button>
                                                                    </div>
                                                                    <div>
                                                                        <h2 className="text-lg font-semibold">{task.title}</h2>
                                                                        <p className="text-sm text-gray-500 mb-3">{task.description}</p>
                                                                        <p className=" text-xs text-gray-400 font-semibold mt-auto italic">Uploaded: {new Date(task.postedTime).toLocaleString()}</p>
                                                                    </div>
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
                                                <div ref={provided.innerRef} {...provided.droppableProps} className="border border-blue-300 h-full bg-blue-100 p-2">
                                                    <h2 className="text-center text-2xl font-semibold p-2 border-b mb-2 text-teal-600">Task Done</h2>
                                                    {doneTasks.map((task, index) => (
                                                        <Draggable key={task._id} draggableId={task._id} index={index}>
                                                            {(provided) => (
                                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="p-2 border mb-1 shadow border-gray-200 bg-blue-50 rounded-md">
                                                                    <div className="flex items-center justify-end gap-0.5">
                                                                        <button onClick={() => handleDelete(task._id)} className="border p-1 rounded bg-red-50 text-red-500 cursor-pointer">
                                                                            <MdDelete />
                                                                        </button>
                                                                        <button onClick={() => handleEditButton(task)} className="border p-1 rounded bg-green-50 text-green-500 cursor-pointer">
                                                                            <FaRegEdit />
                                                                        </button>
                                                                    </div>
                                                                    <div>
                                                                        <h2 className="text-lg font-semibold">{task.title}</h2>
                                                                        <p className="text-sm text-gray-500 mb-3">{task.description}</p>
                                                                        <p className=" text-xs text-gray-400 font-semibold mt-auto italic">Uploaded: {new Date(task.postedTime).toLocaleString()}</p>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                </div>
                                            )}
                                        </Droppable>
                                    </div>

                                </div>
                            </div>
                        </div>


                        :
                        <div>
                            <div className="flex flex-col justify-center items-center mt-16 mb-8">
                                <h2 className="text-3xl font-semibold text-teal-600 flex">Hi..! Welcome</h2>
                                <p className="text-xl font-semibold text-teal-500 flex">to</p>
                                <h2 className="text-4xl font-bold text-teal-600 flex">Taskify</h2>
                            </div>
                            <div>
                                <p className="text-2xl font-semibold text-center italic text-gray-600">Effortless Task Management – Anytime, Anywhere</p>
                                <div className="flex justify-center mt-4">
                                    <SocialLogin></SocialLogin>
                                </div>
                            </div>
                        </div>
                    }

                </div>
            </DragDropContext>


            {/* Show Modal */}
            <dialog id="addTask" className="modal" aria-modal="true">
                <div className="modal-box">
                    <h3 className="font-bold text-xl text-center">Edit Your Task</h3>
                    <form onSubmit={handleEdit} className="w-full space-y-4">
                        {/* Title Field */}
                        <div>
                            <label className="block">Title</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Enter title"
                                defaultValue={editTask.title}
                                className="input input-bordered w-full"
                            />
                        </div>

                        {/* Description Field */}
                        <div>
                            <label className="block">Description</label>
                            <textarea
                                placeholder="Enter description"
                                name="description"
                                defaultValue={editTask.description}
                                className="textarea w-full"
                            />
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