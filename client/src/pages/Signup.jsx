import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Textbox from "../components/Textbox";
import Button from "../components/Button";
import axiosInstance from "../utils/axiosConfig";
import { useMutation } from "@tanstack/react-query";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../redux/slices/authSlice";
import { toast } from "sonner";

const Signup = () => {
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordMatch, setPasswordMatch] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm();

    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const signupMutation = useMutation({
        mutationFn: (data) => axiosInstance.post("auth/sign-up", data),
        onSuccess: (response) => {
            if (response?.data && response?.data?.status === "success") {
                dispatch(
                    setCredentials({
                        user: response.data?.data?.user,
                        token: response.data?.data?.token,
                    })
                );
                toast.success(response.data.message, {
                    duration: 2000,
                    position: 'top-center'
                })
                navigate("/");
            }
        },
        onError: (error) => {
            toast.error(error.response.data.message, {
                duration: 2000,
                position: 'top-center'
            })
        },
    });

    const submitHandler = (data) => {
        signupMutation.mutate(data);
    };

    const checkPasswordStrength = (password) => {
        const length = password.length;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        let strength = 0;
        if (length > 8) strength++;
        if (hasUpperCase) strength++;
        if (hasLowerCase) strength++;
        if (hasNumbers) strength++;
        if (hasSpecialChar) strength++;

        setPasswordStrength(strength);
    };

    const checkPasswordMatch = () => {
        const password = watch("password");
        const confirmPassword = watch("confirmPassword");
        setPasswordMatch(password === confirmPassword);
    };

    useEffect(() => {
        const password = watch("password");
        checkPasswordStrength(password);
        checkPasswordMatch();
    }, [watch("password"), watch("confirmPassword")]);

    useEffect(() => {
        if (user) navigate("/dashboard");
    }, [user]);

    return (
        <div className="w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]">
            <div className="w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center">
                {/* left side */}
                <div className="h-full w-full lg:w-2/3 flex flex-col items-center justify-center">
                    <div className="w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20">
                        <span className="flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base bordergray-300 text-gray-600">
                            Join and start managing your tasks today!
                        </span>
                        <p className="flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-blue-700">
                            <span>Create an Account</span>
                            <span>To Stay Organized</span>
                        </p>
                        {/* <div className="cell">
                            <div className="circle rotate-in-up-left"></div>
                        </div> */}
                    </div>
                </div>

                {/* right side */}
                <div className="w-full md:w-1/3 p-4 md:p-1 flex flex-col justify-center items-center">
                    <form
                        onSubmit={handleSubmit(submitHandler)}
                        className="form-container w-full md:w-[400px] flex flex-col gap-y-8 bg-white px-10 pt-14 pb-14"
                    >
                        <div>
                            <p className="text-blue-600 text-3xl font-bold text-center">
                                Sign Up
                            </p>
                            <p className="text-center text-base text-gray-700">
                                Start your journey with us.
                            </p>
                        </div>

                        <div className="flex flex-col gap-y-5">
                            <Textbox
                                placeholder="Your name"
                                type="text"
                                name="name"
                                label="Full Name"
                                className="w-full rounded-full"
                                register={register("name", {
                                    required: "Full Name is required!",
                                })}
                                error={errors.name ? errors.name.message : ""}
                            />

                            <Textbox
                                placeholder="email@example.com"
                                type="email"
                                name="email"
                                label="Email Address"
                                className="w-full rounded-full"
                                register={register("email", {
                                    required: "Email Address is required!",
                                })}
                                error={errors.email ? errors.email.message : ""}
                            />

                            <Textbox
                                placeholder="your password"
                                type="password"
                                name="password"
                                label="Password"
                                className="w-full rounded-full"
                                register={register("password", {
                                    required: "Password is required!",
                                })}
                                error={errors.password ? errors.password.message : ""}
                            />

                            {/* Password Strength Indicator */}
                            <div className="w-full h-2 mb-4 bg-gray-200 rounded-full">
                                <div
                                    className={`h-full rounded-full ${passwordStrength === 0
                                        ? "bg-red-600"
                                        : passwordStrength === 1
                                            ? "bg-yellow-500"
                                            : passwordStrength === 2
                                                ? "bg-yellow-500"
                                                : passwordStrength === 3
                                                    ? "bg-blue-500"
                                                    : "bg-green-500"
                                        }`}
                                />
                            </div>
                            <span className="text-sm">
                                Password strength:{" "}
                                {passwordStrength === 0
                                    ? "Weak"
                                    : passwordStrength === 1
                                        ? "Fair"
                                        : passwordStrength === 2
                                            ? "Good"
                                            : passwordStrength === 3
                                                ? "Strong"
                                                : "Very Strong"}
                            </span>

                            <Textbox
                                placeholder="Confirm your password"
                                type="password"
                                name="confirmPassword"
                                label="Confirm Password"
                                className="w-full rounded-full"
                                register={register("confirmPassword", {
                                    required: "Please confirm your password!",
                                })}
                                error={errors.confirmPassword ? errors.confirmPassword.message : ""}
                            />
                            {!passwordMatch && (
                                <span className="text-red-500 text-sm">
                                    Passwords do not match!
                                </span>
                            )}

                            <Button
                                type="submit"
                                label="Sign Up"
                                className="w-full h-10 bg-blue-700 text-white rounded-full"
                            />

                            <span
                                className="text-sm text-gray-500 hover:text-blue-600 hover:underline cursor-pointer text-center"
                                onClick={() => navigate("/log-in")}
                            >
                                Already have an account? Login
                            </span>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
