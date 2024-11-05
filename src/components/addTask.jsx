import React, { useState, forwardRef } from "react";
import InputField from "./inputField";
import Button from "./Button";

const AddTask = forwardRef((props, ref) => {
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    const handleSubmit = (e) => {
        e.preventDefault();
        submitForm();
        console.log("this is task", taskTitle, taskDescription);
    }

    const submitForm = async () => {
        setErrorMessage("");
        setShowError(false);

        if (taskTitle === "" || taskDescription === "") {
            setErrorMessage("All fields are Required");
            setShowError(true);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('title', taskTitle);
            formData.append('description', taskDescription);

            await createTask(formData);
        } catch (error) {
            setErrorMessage("Invalid username or password")
            setShowError(true)
        }
    };

    const createTask = async (formData) => {
        console.log("creating task", formData)
        props.closeModal();
    }

    return (
        <div ref={ref} className="flex z-40 flex-col bg-white shadow-lg rounded-lg w-full h-fit items-center justify-center m-2 max-w-3xl p-4">
            <span className='text-3xl font-bold text-blue-600 text-left pb-8'>Add a new task</span>
            <InputField type="text" placeholder="Title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
            <textarea placeholder="Description" value={taskDescription} className="w-full p-4 m-2 rounded-md border-2 border-gray-300 focus:outline-none focus:border-blue-600" onChange={(e) => setTaskDescription(e.target.value)} />
            <button className="px-5 py-2 m-2 rounded-md w-fit text-white bg-blue-600 hover:bg-blue-800" onClick={(e) => handleSubmit(e)} >Add Task</button>
            {showError ? (
                <p className="mt-4 text-sm text-red-600 dark:text-red-400 text-center">{errorMessage}</p>
            ) :
                (<div>
                </div>)}
        </div>
    )
})

export default AddTask;