import React from "react";
import moment from "moment";
import clsx from "clsx";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosConfig";
import { useSelector } from "react-redux";
import { TASK_TYPE, PRIOTITYSTYELS, BGS } from "../utils";
import UserInfo from "./UserInfo";
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdKeyboardDoubleArrowUp } from "react-icons/md";

const ICONS = {
    high: <MdKeyboardDoubleArrowUp />,
    medium: <MdKeyboardArrowUp />,
    low: <MdKeyboardArrowDown />,
};

const TaskTable = () => {
    const { user } = useSelector((state) => state.auth);

    const { data, isError, isPending } = useQuery({
        queryKey: ["todos", user._id],
        queryFn: async () => {
            const response = await axiosInstance.get(`tasks/?userId=${user._id}`);
            return response.data;
        },
        keepPreviousData: true,
    });

    if (isPending) return <p>Loading tasks...</p>;
    if (isError) return <p>Error loading tasks!</p>;

    return (
        <div className="w-full md:w-2/3 bg-white px-2 md:px-4 pt-4 pb-4 shadow-md rounded">
            <table className="w-full">
                <thead className="border-b border-gray-300">
                    <tr className="text-black text-left">
                        <th className="py-2">Task Title</th>
                        <th className="py-2">Priority</th>
                        <th className="py-2">Team</th>
                        <th className="py-2 hidden md:block">Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.data?.map((task, id) => (
                        <tr key={id} className="w-full border-b border-gray-300 text-gray-600 hover:bg-gray-300/10">
                            <td className="py-2">
                                <div className="flex items-center gap-2">
                                    <div className={clsx("w-4 h-4 rounded-full", TASK_TYPE[task.status])} />
                                    <p className="text-base text-black">{task.title}</p>
                                </div>
                            </td>
                            <td className="py-2">
                                <div className="flex gap-1 items-center">
                                    <span className={clsx("text-lg", PRIOTITYSTYELS[task.priority])}>
                                        {ICONS[task.priority]}
                                    </span>
                                    <span className="capitalize">{task.priority}</span>
                                </div>
                            </td>
                            <td className="py-2">
                                <div className="flex">
                                    {task.assignedUsers.map((m, index) => (
                                        <div
                                            key={index}
                                            className={clsx(
                                                "w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1",
                                                BGS[index % BGS.length]
                                            )}
                                        >
                                            <UserInfo user={m} />
                                        </div>
                                    ))}
                                </div>
                            </td>
                            <td className="py-2 hidden md:block">
                                <span className="text-base text-gray-600">{moment(task?.date).fromNow()}</span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TaskTable;
