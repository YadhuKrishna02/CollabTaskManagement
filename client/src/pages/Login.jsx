import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import { useSelector, useDispatch } from "react-redux";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../utils/axiosConfig";
import Loading from "../components/Loader";
import { toast } from "sonner";
import { setCredentials } from "../redux/slices/authSlice";
const Login = () => {
  const { user } = useSelector((state) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginMutation = useMutation(
    {
      mutationFn: (data) => axiosInstance.post("auth/log-in", data),
      onSuccess: (response) => {
        if (response?.data && response?.data?.status == "success") {
          dispatch(setCredentials({
            user: response.data?.data?.user,
            token: response.data?.data?.token,
          }));
          toast.success(response.data.message, {
            position: 'top-center',
            duration: 2000

          });
          navigate("/");
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

  const submitHandler = async (data) => {
    loginMutation.mutate(data);

  };

  useEffect(() => {
    user && navigate("/dashboard");
  }, [user]);

  return (
    <div className='w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]'>
      <div className='w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center'>
        {/* left side */}
        <div className='h-full w-full lg:w-2/3 flex flex-col items-center justify-center'>
          <div className='w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20'>
            <span className='flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base bordergray-300 text-gray-600'>
              Manage all your task in one place!
            </span>
            <p className='flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-blue-700'>
              <span>Cloud-Based</span>
              <span>Task Manager</span>
            </p>

            <div className='cell'>
              <div className='circle rotate-in-up-left'></div>
            </div>
          </div>
        </div>

        {/* right side */}
        <div className='w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center'>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className='form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14'
          >
            <div className=''>
              <p className='text-blue-600 text-3xl font-bold text-center'>
                Welcome back!
              </p>
              <p className='text-center text-base text-gray-700 '>
                Keep all your credential safe.
              </p>
            </div>

            <div className='flex flex-col gap-y-5'>
              <Textbox
                placeholder='email@example.com'
                type='email'
                name='email'
                label='Email Address'
                className='w-full rounded-full'
                register={register("email", {
                  required: "Email Address is required!",
                })}
                error={errors.email ? errors.email.message : ""}
              />
              <Textbox
                placeholder='your password'
                type='password'
                name='password'
                label='Password'
                className='w-full rounded-full'
                register={register("password", {
                  required: "Password is required!",
                })}
                error={errors.password ? errors.password.message : ""}
              />


              {loginMutation.isPending ? <Loading /> : (
                <Button
                  type='submit'
                  label='Submit'
                  className='w-full h-10 bg-blue-700 text-white rounded-full'
                />
              )}

              <span
                className='text-sm text-gray-500 hover:text-blue-600 hover:underline cursor-pointer text-center'
                onClick={() => navigate("/sign-up")}
              >
                Don't have an account? SignUp
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
