import React, { useState, forwardRef } from "react";
import InputField from "./inputField";


const AddTask = forwardRef((props, ref) => {
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskStatus, setTaskStatus] = useState('todo'); // Default status
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleStatusChange = (status) => {
        setTaskStatus(status);
        setIsDropdownOpen(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        submitForm();
        console.log("this is task", taskTitle, taskDescription, taskStatus);
    }

    const submitForm = async () => {
        setErrorMessage("");
        setShowError(false);
        setLoading(true);

        if (taskTitle === "" || taskDescription === "" ) {
            setErrorMessage("All fields are Required");
            setShowError(true);
            return;
        }

        if (taskDescription.length < 5 || taskTitle.length < 5) {
            setErrorMessage("Description and Title should be at least 5 characters long");
            setShowError(true);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', taskTitle);
            formData.append('description', taskDescription);
            formData.append('status', taskStatus);

            await props.createTask(formData);
            setLoading(false);
        } catch (error) {
            setErrorMessage("Invalid username or password")
            setShowError(true)
        }
    };


    return (
        <div ref={ref} className="flex z-40 flex-col bg-white shadow-lg rounded-lg w-full h-fit items-center justify-center m-2 max-w-3xl p-4">
            <span className='text-3xl font-bold text-blue-600 text-left pb-8'>Add a new task</span>
            <InputField type="text" placeholder="Title" value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} />
            <textarea placeholder="Description" value={taskDescription} className="w-full p-4 m-2 rounded-md border-2 border-gray-300 focus:outline-none focus:border-blue-600" onChange={(e) => setTaskDescription(e.target.value)} />
            <div className="relative flex items-start w-full p-2 m-2">
                <button
                    className="w-fit p-2 border rounded-md bg-gray-100 hover:bg-gray-200"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    {taskStatus.charAt(0).toUpperCase() + taskStatus.slice(1)}
                </button>
                {isDropdownOpen && (
                    <div className="absolute w-fit bg-white border border-gray-300 rounded-md shadow-md z-50">
                        {['todo', 'inprogress', 'done'].map((status) => (
                            <div
                                key={status}
                                className="p-2 hover:bg-blue-100 cursor-pointer"
                                onClick={() => handleStatusChange(status)}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <button className="px-5 py-2 m-2 rounded-md w-fit text-white bg-blue-600 hover:bg-blue-800" onClick={(e) => handleSubmit(e)} >Add Task</button>
            {showError ? (
                <p className="mt-4 text-sm text-red-600 dark:text-red-400 text-center">{errorMessage}</p>
            ) :
                (<div>
                </div>)}
            {loading && <div class="absolute items-center w-full h-full  rounded-lg shadow-md bg-opacity-45 bg-black">
                <div role="status" class="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
                    <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                    <span class="sr-only">Loading...</span>
                </div> 
            </div>}
        </div>
    )
})

export default AddTask;