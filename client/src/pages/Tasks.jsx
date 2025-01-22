import React, { useState, useMemo, useEffect } from "react";
import { MdGridView } from "react-icons/md";
import { useParams } from "react-router-dom";
import Loading from "../components/Loader";
import Title from "../components/Title";
import Button from "../components/Button";
import { IoMdAdd } from "react-icons/io";
import TaskTitle from "../components/TaskTitle";
import AddTask from "../components/task/AddTask";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosConfig";
import { useSelector } from "react-redux";
import Column from "../components/Column";
import { DndContext } from "@dnd-kit/core";
import { useMutation } from "@tanstack/react-query";
const TASK_TYPE = {
  todo: "bg-blue-600",
  "in progress": "bg-yellow-600",
  completed: "bg-green-600",
};

import { toast } from "sonner";
import { TYPES } from "../constants/notificationTypes";
const Tasks = () => {
  const params = useParams();
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const status = params?.status || "";
  const [tasks, setTasks] = useState([])
  const { isPending, isError, data, error } = useQuery({
    queryKey: ['todos', user._id],
    queryFn: async () => {
      const response = await axiosInstance.get(`tasks/?userId=${user._id}`);
      return response.data;
    },
    keepPreviousData: true,

  })
  const updateMutation = useMutation(
    {
      mutationFn: ({ taskId, ...data }) => axiosInstance.put(`tasks/${taskId}`, data),
      onSuccess: async (response) => {
        console.log(response, 'heiii')
        if (response?.data) {
          toast.success("Task Updated Successfully", {
            position: 'top-center',
            duration: 2000

          });

          try {
            const notificationPayload = {
              type: TYPES['STATUS_CHANGED'],
              message: `Status changed for "${response.data?.title}" has been changed.`,
              task: response.data?._id,
              assignedUser: response?.data.assigned_users,
              status: response?.data?.status
            };
            await axiosInstance.post(`notifications`, notificationPayload);
            toast.success("Notification created successfully!", {
              duration: 2000,
              position: 'top-center',
            });
          } catch (error) {
            console.log(error, 'popopo')
            toast.error("Failed to create notification", {
              position: 'top-center',
              duration: 2000
            });
          }
        }
      },
      onError: (error) => {
        toast.error(error.response.data.error, {
          position: 'top-center',
          duration: 2000
        });
      },
    }
  );


  useEffect(() => {
    setTasks(data?.data)
  }, [data])
  const taskColumns = useMemo(() => {
    if (!data?.data) return [];

    const pendingTasks = data.data.filter((task) => task.status === "pending");
    const inProgressTasks = data.data.filter((task) => task.status === "in progress");
    const completedTasks = data.data.filter((task) => task.status === "completed");

    return [
      { label: "To Do", id: "pending", tasks: pendingTasks },
      { label: "In Progress", id: "in progress", tasks: inProgressTasks },
      { label: "Completed", id: "completed", tasks: completedTasks },
    ];
  }, [tasks]);

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over) return

    const taskId = active.id
    const newStatus = over.id
    const updatedTasks = tasks?.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    );

    setTasks(updatedTasks);
    updateMutation.mutate({ taskId, status: newStatus });
  }

  return isPending ? (
    <div className='py-10'>
      <Loading />
    </div>
  ) : (
    <div className='w-full'>
      <div className='flex items-center justify-between mb-4'>
        <Title title={status ? `${status} Tasks` : "Tasks"} />

        {user.role === "admin" && (
          <Button
            onClick={() => setOpen(true)}
            label='Create Task'
            icon={<IoMdAdd className='text-lg' />}
            className='flex flex-row-reverse gap-1 items-center bg-blue-600 text-white rounded-md py-2 2xl:py-2.5'
          />
        )}
      </div>

      {!status && (
        <div className='w-full flex justify-between gap-4 md:gap-x-12 py-4'>
          <TaskTitle label='To Do' className={TASK_TYPE.todo} />
          <TaskTitle
            label='In Progress'
            className={TASK_TYPE["in progress"]}
          />
          <TaskTitle label='completed' className={TASK_TYPE.completed} />
        </div>
      )}

      <div className="w-full">
        {/* Task columns */}
        <DndContext onDragEnd={handleDragEnd}>
          <div className="w-full flex gap-4">
            {taskColumns.map((column, index) => (
              <div key={column.id} className="flex-1">
                <Column tasks={tasks.filter((task) => task.status === column.id)} column={column} />
              </div>
            ))}
          </div>
        </DndContext>
      </div>


      <AddTask open={open} setOpen={setOpen} />
    </div>
  );
};

export default Tasks;
