import React, { useState } from "react";
import ModalWrapper from "../ModalWrapper";
import { Dialog } from "@headlessui/react";
import Textbox from "../Textbox";
import { useForm } from "react-hook-form";
import UserList from "./UserList";
import SelectList from "../SelectList";
import { BiImages } from "react-icons/bi";
import Button from "../Button";
import axiosInstance from "../../utils/axiosConfig";
import { useQuery, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { TYPES } from "../../constants/notificationTypes";
import { useSelector } from "react-redux";
const LISTS = ["PENDING", "IN PROGRESS", "COMPLETED"];
const PRIORITY = ["HIGH", "MEDIUM", "LOW"];

const uploadedFileURLs = [];

const AddTask = ({ open, setOpen }) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();
  // title, description, priority, status, assigned_user, due_date 
  const { user } = useSelector((state) => state.auth);
  const [assignedUser, setAssignedUser] = useState([]);
  const [status, setStatus] = useState(LISTS[0]);
  const [priority, setPriority] = useState(PRIORITY[2]

  );
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await axiosInstance.get(`users`);
      return response.data;
    },
    enabled: user.role == "admin"
  })

  const addTaskMutation = useMutation({
    mutationFn: (payload) => axiosInstance.post(`/tasks`, payload),
    onSuccess: async (response) => {
      console.log(response, 'ssss')
      if (response.data.status === "success") {
        toast.success("Task added successfully!", {
          duration: 2000,
          position: 'top-center'
        })
        try {
          const notificationPayload = {
            type: TYPES['TASK_CREATED'],
            message: `A new task titled "${response.data.data.title}" has been created.`,
            task: response.data.data._id,
            assignedUser: response.data.data.assigned_users,
            status: response?.data?.data?.status

          };
          await axiosInstance.post(`notifications`, notificationPayload);
          toast.success("Notification created successfully!", {
            duration: 2000,
            position: 'top-center',
          });
        } catch (error) {
          toast.error("Failed to create notification");
        }
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

    addTaskMutation.mutate(payload);
  };


  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(submitHandler)}>
          <Dialog.Title
            as='h2'
            className='text-base font-bold leading-6 text-gray-900 mb-4'
          >
            {"ADD TASK"}
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

            <UserList isPending={isPending} isError={isError} setAssignedUser={setAssignedUser} assignedUser={data && data?.data} />

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

export default AddTask;
