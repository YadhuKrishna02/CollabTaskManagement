import clsx from "clsx";
import React, { useState } from "react";
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { useSelector } from "react-redux";
import { BGS, PRIOTITYSTYELS, TASK_TYPE, formatDate } from "../utils";
import TaskDialog from "./task/TaskDialog";
import UserInfo from "./UserInfo";
import { useDraggable } from "@dnd-kit/core";
import { BsThreeDots } from "react-icons/bs";
import EditTask from "./task/EditTask";
const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const TaskCard = ({ task }) => {
  const { user } = useSelector((state) => state.auth);
  const [open, setOpen] = useState(false);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id
  })

  const style = transform ? (
    {
      transform: `translate(${transform.x}px, ${transform.y}px)`,
    }
  ) : undefined
  return (
    <div ref={setNodeRef}{...listeners}{...attributes} style={style} className='w-full  bg-white shadow-md p-4 rounded'>
      <div className='w-full flex justify-between'>
        <div
          className={clsx(
            "flex flex-1 gap-1 items-center text-sm font-medium",
            PRIOTITYSTYELS[task?.priority]
          )}
        >
          <span className='text-lg'>{ICONS[task?.priority]}</span>
          <span className='uppercase'>{task?.priority} Priority</span>
        </div>
        {/* <div>
          <BsThreeDots onClick={() => setOpen(true)} />

        </div> */}
        {user?.isAdmin && <TaskDialog task={task} />}
      </div>

      <>
        <div className='flex items-center gap-2'>
          <div
            className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.status])}
          />
          <h4 className='line-clamp-1 text-black'>{task?.title}</h4>
        </div>
        <span className='text-sm text-gray-600'>
          {formatDate(new Date(task?.dueDate))}
        </span>
      </>

      <div className='w-full border-t border-gray-200 my-2' />
      <div className='flex items-center justify-between mb-2'>


        <div className='flex flex-row-reverse'>
          {task?.assignedUsers?.map((m, index) => (
            <div
              key={index}
              className={clsx(
                "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                BGS[index % BGS?.length]
              )}
            >
              <UserInfo user={m} />
            </div>
          ))}
        </div>
      </div>



      {/* <EditTask open={open} setOpen={setOpen} taskId={task?.id} /> */}
    </div>

  );
};

export default TaskCard;
