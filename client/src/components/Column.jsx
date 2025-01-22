import React from "react";
import TaskCard from "./TaskCard";
import { useDroppable } from "@dnd-kit/core";

const Column = ({ column, tasks }) => {
  const { setNodeRef } = useDroppable({
    id: column.id
  })
  const columnBackground = {
    pending: "bg-blue-100",
    "in progress": "bg-yellow-100",
    completed: "bg-green-100",
  };

  return (
    <div ref={setNodeRef} className={`w-full py-4 flex flex-col gap-4 p-4 h-fit ${tasks.length > 0 ? columnBackground[column.id] : ""
      }`} style={{ minHeight: "300px", position: 'relative' }} >
      {tasks.map((task) => (
        <TaskCard task={task} key={task.id} />
      ))}
    </div>
  );
};

export default Column;
