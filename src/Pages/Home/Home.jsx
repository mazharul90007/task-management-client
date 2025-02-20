import { useForm } from "react-hook-form";
import SocialLogin from "../../Components/SocialLogin/SocialLogin";
import useAuth from "../../Hooks/useAuth";
import useAxiosPublic from "../../Hooks/useAxiosPublic";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
// import axios from "axios";


const Home = () => {
    const { user, setUser, logOut } = useAuth()
    const { register, handleSubmit, reset, formState: { errors } } = useForm()
    const axiosPublic = useAxiosPublic()


    const handleLogOut = () => {
        logOut()
            .then(() => {
                setUser(null);

            })
            .catch(error => {
                console.log(error);
            })
    }

    const { data: todoTasks = [], refetch } = useQuery({
        queryKey: ["todoTasks", user?.email],
        queryFn: async () => {
            if (!user?.email) return [];
            const res = await axiosPublic.get('/tasks', {
                params: { email: user.email, category: 'todo' }
            });
            return res.data;
        },
        enabled: !!user?.email,
    });

    console.log(todoTasks)


    const openModal = () => {
        document.getElementById('addReview')?.showModal()
    };

    const closeModal = () => {
        document.getElementById('addReview')?.close();
    };

    const handleReviewButton = () => {
        openModal()
    }

    const onSubmit = async (data) => {

        const taskInfo = {
            title: data.title,
            description: data.description,
            postedTime: Date.now(),
            category: 'todo',
            email: user.email
        }
        console.log(taskInfo)

        const taskRes = await axiosPublic.post('/tasks', taskInfo);
        await refetch();
        if (taskRes.data.insertedId) {
            toast.success("Task Submission Successful")
        } else {
            toast.error('Something Wrong...!')
        }

        reset();
        closeModal()
    }




    return (
        <div>
            <div className="flex gap-2 items-center justify-end">
                <SocialLogin></SocialLogin>
                <button onClick={handleLogOut} className="btn btn-success">LogOut</button>
            </div>
            <div className="text-center">
                <h3 className="text-3xl font-semibold text-teal-600">Your Daily Task</h3>
            </div>
            <div className=" w-11/12 mx-auto">
                {
                    user?.email ?
                        <div>
                            <div className="grid md:grid-cols-3 gap-2 mt-16 h-full">
                                <div className="border border-red-400 h-full">
                                    <h2 className="text-center text-2xl font-semibold pb-4 border-b">Task to Do</h2>
                                    <div className="p-2">
                                        {
                                            todoTasks.map(task =>
                                                <div key={task._id} className="p-2 border mb-1 shadow border-gray-200">
                                                    <div className="flex items-center justify-end gap-0.5">
                                                        <div className="border p-1 rounded bg-red-50 text-red-500"><MdDelete /></div>
                                                        <div className="border p-1 rounded bg-green-50 text-green-500"><FaRegEdit /></div>
                                                    </div>
                                                    <h2 className="text-lg font-semibold">{task.title}</h2>
                                                    <p className="text-sm text-gray-500">{task.description}</p>
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                                <div className="border border-yellow-400 h-full">
                                    <h2 className="text-center text-2xl font-semibold pb-4 border-b">Task In Progress</h2>
                                </div>
                                <div className="border border-green-400 h-full">
                                    <h2 className="text-center text-2xl font-semibold pb-4 border-b">Task Done</h2>
                                </div>

                            </div>
                            <div>
                                <h3 className="text-center text-2xl font-semibold"> Update your Daily Task</h3>
                                <button onClick={() => handleReviewButton()} className="btn btn-success mx-auto flex my-2">Add Task</button>
                            </div>
                        </div>

                        :
                        <div>

                        </div>
                }
            </div>

            {/* Show Modal */}
            <dialog id="addReview" className="modal" aria-modal="true">
                <div className="modal-box">
                    <h3 className="font-bold text-xl text-center">Type Your Task</h3>
                    <form onSubmit={handleSubmit(onSubmit)} method="dialog" className="w-full space-y-4">
                        {/* Title */}
                        <div>
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
                        <div>
                            <label className="block">Description</label>
                            <textarea
                                placeholder="Enter description"
                                {...register('description', {
                                    required: "Description is required",
                                    maxLength: { value: 200, message: "Description cannot exceed 200 characters" }
                                })}
                                className="textarea w-full"
                            />
                            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                        </div>

                        <button className="btn btn-sm border border-green-500 mt-1 text-green-700">Post</button>
                    </form>
                    <div className="flex justify-end">
                        <button onClick={() => closeModal()} className="btn btn-sm border border-red-600 text-primary">X</button>
                    </div>
                </div>
            </dialog>


        </div>
    );
};

export default Home;