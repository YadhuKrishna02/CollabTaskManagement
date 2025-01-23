import { Popover, Transition } from "@headlessui/react";
import moment from "moment";
import { Fragment, useState } from "react";
import { BiSolidMessageRounded } from "react-icons/bi";
import { HiBellAlert } from "react-icons/hi2";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { useSelector } from "react-redux";
const ICONS = {
  alert: (
    <HiBellAlert className='h-5 w-5 text-gray-600 group-hover:text-indigo-600' />
  ),
  message: (
    <BiSolidMessageRounded className='h-5 w-5 text-gray-600 group-hover:text-indigo-600' />
  ),
};

const NotificationPanel = () => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [socket, setSocket] = useState(null);
  const [data, setData] = useState([])
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    const newSocket = io("http://localhost:4000", {
      transports: ["websocket"], // Use WebSocket transport only
    });
    setSocket(newSocket);

    // Clean up the socket connection
    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("taskStatusUpdated", (payload) => {


        // Only show the notification if the current user's ID is in the assignedUsers array
        if (payload.updatedFields.assignedUsers.includes(user._id) || user.role == "admin") {
          const newNotification = {
            _id: payload.taskId,
            text: `Task status updated: ${payload.updatedFields.status} for task ${payload.updatedFields.title}`,
            notiType: "alert",
            createdAt: new Date().toISOString(),
          };

          // Save notification to localStorage
          const updatedNotifications = [...data, newNotification];
          localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
          setData(updatedNotifications);
        }
      });
    }
  }, [socket, data]);
  useEffect(() => {
    const savedNotifications = JSON.parse(localStorage.getItem('notifications')) || [];
    setData(savedNotifications);
  }, []);

  //  const { data, refetch } = useGetNotificationsQuery();
  //  const [markAsRead] = useMarkNotiAsReadMutation();

  const readHandler = () => { };
  const viewHandler = () => { };

  const callsToAction = [
    { name: "Cancel", href: "#", icon: "" },

  ];

  return (
    <>
      <Popover className='relative'>
        <Popover.Button className='inline-flex items-center outline-none'>
          <div className='w-8 h-8 flex items-center justify-center text-gray-800 relative'>
            <IoIosNotificationsOutline className='text-2xl' />
            {data?.length > 0 && (
              <span className='absolute text-center top-0 right-1 text-sm text-white font-semibold w-4 h-4 rounded-full bg-red-600'>
                {data?.length}
              </span>
            )}
          </div>
        </Popover.Button>

        <Transition
          as={Fragment}
          enter='transition ease-out duration-200'
          enterFrom='opacity-0 translate-y-1'
          enterTo='opacity-100 translate-y-0'
          leave='transition ease-in duration-150'
          leaveFrom='opacity-100 translate-y-0'
          leaveTo='opacity-0 translate-y-1'
        >
          <Popover.Panel className='absolute -right-16 md:-right-2 z-10 mt-5 flex w-screen max-w-max px-4'>
            {({ close }) =>
              data?.length > 0 && (
                <main className='flex flex-col rounded-3xl'>
                  <div className='w-screen max-w-md flex-auto max-h-[400px] overflow-y-auto rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5'>
                    <div className='p-4'>
                      {data?.map((item, index) => (
                        <div
                          key={item._id + index}
                          className='group relative flex gap-x-4 rounded-lg p-4 hover:bg-gray-50'
                        >
                          <div className='mt-1 h-8 w-8 flex items-center justify-center rounded-lg bg-gray-200 group-hover:bg-white'>
                            {ICONS[item.notiType]}
                          </div>

                          <div
                            className='cursor-pointer'
                            onClick={() => viewHandler(item)}
                          >
                            <div className='flex items-center gap-3 font-semibold text-gray-900 capitalize'>
                              <p> {item.notiType}</p>
                              <span className='text-xs font-normal lowercase'>
                                {moment(item.createdAt).fromNow()}
                              </span>
                            </div>
                            <p className='mt-1 text-gray-600 overflow-y-auto max-h-20'>
                              {item.text}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className='p-3 bg-gray-50 flex justify-center'>
                      <button
                        onClick={() => close()}
                        className='px-4 py-2 font-semibold text-blue-600 bg-white rounded-lg shadow-sm hover:bg-gray-100'
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </main>
              )
            }
          </Popover.Panel>

        </Transition>
      </Popover>
    </>
  );
};

export default NotificationPanel;
