import React, { useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import UserList from "./UserList";
import SelectList from "../SelectList";
import Button from "../Button";
import axiosInstance from "../../utils/axiosConfig";
import { useQueries, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useSelector } from "react-redux";
const LISTS = ["PENDING", "IN PROGRESS", "COMPLETED"];
const PRIORITY = ["HIGH", "MEDIUM", "LOW"];


const EditTask = ({ open, setOpen, taskId }) => {

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm();
    // title, description, priority, status, assigned_user, due_date 
    const [assignedUser, setAssignedUser] = useState([]);
    const [status, setStatus] = useState(LISTS[0]);
    const [priority, setPriority] = useState(PRIORITY[2]
    );
    const { user } = useSelector((state) => state.auth);

    const queries = useQueries({
        queries: [
            {
                queryKey: ["user"],
                queryFn: async () => {
                    const response = await axiosInstance.get("users");
                    return response.data;
                },
                enabled: user.role === "admin"

            },
            {
                queryKey: ["task", "taskId"],
                queryFn: async () => {
                    const response = await axiosInstance.get(`tasks/${taskId}`);
                    return response.data;
                },
                enabled: true,
            },
        ],
    });

    const [userQuery, taskQuery] = queries;

    const {
        data: userData,
        isPending: isUserLoading,
        isError: isUserError,
        error: userError,
    } = userQuery;

    const {
        data: taskData,
        isPending: isTaskLoading,
        isError: isTaskError,
        error: taskError,
    } = taskQuery;

    const editTaskMutation = useMutation({
        mutationFn: (id) => axiosInstance.put(`/tasks/:${id}`),
        onSuccess: (response) => {
            if (response.data.status === "success") {
                toast.success("Task added successfully!", {
                    duration: 2000,
                    position: 'top-center'
                })
                reset();
                setAssignedUser([]);
                setStatus("PENDING");
                setPriority("LOW");
                setOpen(false);
            }



        },
        onError: (error) => {
            toast.error(error.response?.data?.message || "Failed to add task");
        },
    });

    const submitHandler = async (formData) => {
        const payload = {
            ...formData,
            assignedUser,
            status: status.toLowerCase(),
            priority: priority.toLowerCase(),
        };

        editTaskMutation.mutate(payload);
    };


    return (
        <>
            <ModalWrapper open={open} setOpen={setOpen}>
                <form onSubmit={handleSubmit(submitHandler)}>
                    <Dialog.Title
                        as='h2'
                        className='text-base font-bold leading-6 text-gray-900 mb-4'
                    >
                        {"EDIT TASK"}
                    </Dialog.Title>

                    <div className='mt-2 flex flex-col gap-6'>
                        <Textbox
                            placeholder='Task Title'
                            type='text'
                            name='title'
                            label='Task Title'
                            className='w-full rounded'
                            register={register("title", { required: "Title is required" })}
                            error={errors.title ? errors.title.message : ""}
                        />
                        <Textbox
                            placeholder="Task Description"
                            type="text"
                            name="description"
                            label="Description"
                            className="w-full rounded"
                            register={register("description", {
                                required: "Description is required",
                            })}
                            error={errors.description ? errors.description.message : ""}
                        />

                        <UserList setAssignedUser={setAssignedUser} assignedUser={userData && userData?.data} />

                        <div className='flex gap-4'>
                            <SelectList
                                label='Task Status'
                                lists={LISTS}
                                selected={status}
                                setSelected={setStatus}
                            />

                            <div className='w-full'>
                                <Textbox
                                    placeholder='Date'
                                    type='date'
                                    name='dueDate'
                                    label='Task Date'
                                    className='w-full rounded'
                                    register={register("dueDate", {
                                        required: "Date is required!",
                                    })}
                                    error={errors.dueDate ? errors.dueDate.message : ""}
                                />
                            </div>
                        </div>

                        <div className='flex gap-4'>
                            <SelectList
                                label='Priority Level'
                                lists={PRIORITY}
                                selected={priority}
                                setSelected={setPriority}
                            />

                        </div>

                        <div className='bg-gray-50 py-6 sm:flex sm:flex-row-reverse gap-4'>

                            <Button
                                label='Submit'
                                type='submit'
                                className='bg-blue-600 px-8 text-sm font-semibold text-white hover:bg-blue-700  sm:w-auto'
                            />

                            <Button
                                type='button'
                                className='bg-white px-5 text-sm font-semibold text-gray-900 sm:w-auto'
                                onClick={() => setOpen(false)}
                                label='Cancel'
                            />
                        </div>
                    </div>
                </form>
            </ModalWrapper>
        </>
    );
};

export default EditTask;
