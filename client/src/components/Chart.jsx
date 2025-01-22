import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
// import { chartData } from "../assets/data";
import axiosInstance from "../utils/axiosConfig";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import Loading from "./Loader";
export const Chart = () => {
  const { user } = useSelector((state) => state.auth);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['chartData', user._id],
    queryFn: async () => {
      const response = await axiosInstance.get(`dashboard/chartData?userId=${user._id}&role=${user.role}`);
      return response.data;
    },
  })

  return (
    <>
      {isPending && <Loading />}
      {isError && (
        <div className="text-center text-red-500">
          <p>Failed to load chart data.</p>
          <p>{error.message || "An unexpected error occurred."}</p>
        </div>
      )}
      <ResponsiveContainer width={"100%"} height={300}>
        <BarChart width={150} height={40} data={data?.data}>
          <XAxis dataKey='name' />
          <YAxis />
          <Tooltip />
          <Legend />
          <CartesianGrid strokeDasharray='3 3' />
          <Bar dataKey='total' fill='#8884d8' />
        </BarChart>
      </ResponsiveContainer>
    </>

  );
};
