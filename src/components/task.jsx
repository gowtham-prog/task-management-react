import React, { useState, useEffect, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { SERVER_URL } from '../config';
import axios from 'axios';

const ItemType = {
    TASK: 'task',
};

function Modal({ task, onClose, type, modal, triggerFetch }) {
    const [name, setName] = useState(task.name);
    const [description, setDescription] = useState(task.description);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modal && modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [modalRef]);

    const handleEdit = async () => {
        setLoading(true);
        try {
            const response = await axios.put(`${SERVER_URL}/task/update/${task._id}`, {
                name: name,
                description: description,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Task updated successfully:', response.data);
            
        } catch (error) {
            console.error('Error editing task:', error);
            setErrorMessage(error?.message || "Failed to Update task");
            setShowError(true);
        }
        setLoading(false);
        triggerFetch();
        onClose();
    };


    const handleDelete = async () => {
        try {
            const response = await axios.delete(`${SERVER_URL}/task/delete/${task._id}`,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                }});
            console.log('Task deleted successfully:', response.data);
            
        } catch (error) {
            console.error('Error deleting task:', error);
            setErrorMessage(error?.message || "Failed to delete task");
            setShowError(true);
        }
        setLoading(false);
        triggerFetch();
        onClose();
    };
    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 w-full h-full flex items-center justify-center z-50">
            <div ref={modalRef} className={`bg-white rounded-md shadow-lg w-3/4 ${type === 'delete' ? 'h-fit' : 'h-3/4'}  max-w-lg p-6 relative`}>
                {type === 'view' && (
                    <div className='flex flex-col items-start w-full h-1/4'>
                        <h2 className="text-2xl font-bold mb-4">Task Details</h2>
                        <div className="mb-4">
                            <p className="text-xl font-medium mb-2">Title: {task.name}</p>
                            <p className="text-lg mb-2">Description: {task.description}</p>
                            <p className="text-md text-gray-600">Created At: {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <div className="absolute bottom-2 right-2">
                            <button className="px-5 py-2 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-800" onClick={onClose}>
                                Close
                            </button>
                        </div>
                    </div>
                )}
                {type === 'edit' &&
                    <>
                        <h2 key={task.id} className="text-2xl font-bold mb-4">Edit Task</h2>
                        <div className="mb-4">
                            <div className='mt-2'>
                                <span className='text-xl text-gray-600 font-semibold'>Title</span>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className='w-full pb-4 border-b-2 border-gray-300 focus:outline-none focus:border-blue-600' />
                            </div>
                            <div className='mt-2'>
                                <p className='text-lg text-gray-600 font-semibold'>Description</p>
                                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} className='w-full pb-4 h-16 text-start border-b-2 border-gray-300 focus:outline-none focus:border-blue-600' />
                            </div>
                        </div>
                        <div className='absolute bottom-2 right-2 flex flex-row w-fit'>
                            <button className="px-5 py-2 mr-4 rounded-md font-semibold text-black bg-gray-300 hover:bg-gray-800" onClick={handleEdit}>Save</button>
                            <button className="px-5 py-2 rounded-md font-semibold text-white bg-gray-600 hover:bg-gray-800" onClick={onClose}>Cancel</button>
                        </div>
                    </>
                }
                {
                    type === 'delete' &&
                    <div className='flex flex-col items-start w-full h-full'>
                        <h2 key={task.id} className="text-2xl font-bold mb-4">Delete Task</h2>
                        <div className="my-4">
                            <p className="text-lg font-medium mb-2">Are you sure you want to delete this task?</p>
                        </div>
                        <div className='flex flex-row w-full justify-end pt-4'>
                            <button className="px-5 py-2 mr-4 rounded-md font-semibold text-black bg-red-500 hover:bg-red-800" onClick={handleDelete}>Delete</button>
                            <button className="px-5 py-2 rounded-md font-semibold text-white bg-gray-600 hover:bg-gray-800" onClick={onClose}>Cancel</button>
                        </div>
                    </div>
                }
                {showError ? (
                    <p className="mt-4 text-sm text-red-600 dark:text-red-400 text-center">{errorMessage}</p>
                ) :
                    (<div>
                    </div>)}
            </div>
            {loading && <div class="absolute items-center w-full h-full  rounded-lg shadow-md bg-opacity-45 bg-black">
                <div role="status" class="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
                    <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
                    <span class="sr-only">Loading...</span>
                </div> 
            </div>}
        </div>
    );
}

export default function Task({ task, index, moveTask, triggerFetch }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [type, setType] = useState('edit');

    const [{ isDragging }, dragRef] = useDrag({
        type: ItemType.TASK,
        item: { id: task._id, index, currentStatus: task.status },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, dropRef] = useDrop({
        accept: ItemType.TASK,
        hover(draggedItem) {
            if (draggedItem.currentStatus === task.status && draggedItem.index !== index) {
                moveTask(draggedItem.index, index, task.status, draggedItem.currentStatus, draggedItem.id);
                draggedItem.index = index;
                draggedItem.currentStatus = task.status;
            }
        },
    });


    return (
        <>
            <div
                ref={(node) => dragRef(dropRef(node))} key={task.id}
                className={`flex flex-col w-full h-fit ${isDragging ? 'opacity-50' : 'opacity-100'} bg-blue-200 rounded-lg shadow-lg p-4 my-2`}
            >
                <span className="pointer-events-none text-xl font-bold">{task.name}</span>
                <span className="pointer-events-none text-lg">{task.description}</span>
                <span className="pointer-events-none text-md mt-6">{new Date(task.createdAt).toLocaleDateString()}</span>
                <div className="flex flex-row w-full bottom-2 left-2 items-center justify-end">
                    <button
                        className="px-2 py-2 ml-2 rounded-md w-fit text-white bg-red-500 hover:bg-red-800"
                        onClick={() => { setType('delete'); setIsModalOpen(true); }}
                    >
                        Delete
                    </button>
                    <button
                        className="px-2 py-2 mx-2 rounded-md w-fit text-white bg-blue-400 hover:bg-blue-600"
                        onClick={() => { setType('edit'); setIsModalOpen(true); }}
                    >
                        Edit
                    </button>
                    <button
                        className="px-2 py-2 rounded-md w-fit text-white bg-blue-600 hover:bg-blue-900"
                        onClick={() => { setType('view'); setIsModalOpen(true); }}
                    >
                        View Details
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <Modal
                    task={task}
                    onClose={() => setIsModalOpen(false)}
                    type={type}
                    modal={isModalOpen}
                    triggerFetch={triggerFetch}
                />
            )}
        </>
    );
}
