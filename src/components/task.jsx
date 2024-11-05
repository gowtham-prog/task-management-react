import React, { useState, useEffect, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { SERVER_URL } from '../config';
import axios from 'axios';

const ItemType = {
    TASK: 'task',
};

function Modal({ task, onClose, onEdit, onDelete, type, modal}) {
    const [name, setName] = useState(task.name);
    const [description, setDescription] = useState(task.description);
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


    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 w-full h-full flex items-center justify-center z-50">
            <div ref={modalRef} className={`bg-white rounded-md shadow-lg w-3/4 ${type === 'delete' ? 'h-fit' : 'h-3/4'}  max-w-lg p-6 relative`}>
                {type === 'view' && (
                    <div className='flex flex-col items-start w-full h-1/4'>
                        <h2 className="text-2xl font-bold mb-4">Task Details</h2>
                        <div className="mb-4">
                            <p className="text-xl font-medium mb-2">Title: {task.name}</p>
                            <p className="text-lg mb-2">Description: {task.description}</p>
                            <p className="text-md text-gray-600">Created At: {task.createdAt ? task.createdAt.toDateString() : 'N/A'}</p>
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
                            <input type="text" value={name} onChange= {(e) => setName(e.target.value)} className='w-full pb-4 border-b-2 border-gray-300 focus:outline-none focus:border-blue-600' />
                            </div>
                            <div className='mt-2'>
                            <p className='text-lg text-gray-600 font-semibold'>Description</p>
                            <input type="text" value={description} onChange= {(e) => setDescription(e.target.value)} className='w-full pb-4 h-16 text-start border-b-2 border-gray-300 focus:outline-none focus:border-blue-600' />
                            </div>
                        </div>
                        <div className='absolute bottom-2 right-2 flex flex-row w-fit'>
                            <button className="px-5 py-2 mr-4 rounded-md font-semibold text-black bg-gray-300 hover:bg-gray-800" onClick={onEdit}>Save</button>
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
                            <button className="px-5 py-2 mr-4 rounded-md font-semibold text-black bg-red-500 hover:bg-red-800" onClick={onDelete}>Delete</button>
                            <button className="px-5 py-2 rounded-md font-semibold text-white bg-gray-600 hover:bg-gray-800" onClick={onClose}>Cancel</button>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default function Task({ task, index, moveTask }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [type, setType] = useState('edit');

    const [{ isDragging }, dragRef] = useDrag({
        type: ItemType.TASK,
        item: { id: task.id, index, currentStatus: task.status },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, dropRef] = useDrop({
        accept: ItemType.TASK,
        hover(draggedItem) {
            if (draggedItem.currentStatus === task.status && draggedItem.index !== index) {
                moveTask(draggedItem.index, index, task.status);
                draggedItem.index = index;
            }
        },
    });

    const handleEdit = async (updatedTask) => {
        try {
            const response = await axios.put(`${SERVER_URL}/${task.id}`, {
                name: updatedTask.name,  // Replace with the necessary data properties
                description: updatedTask.description,
                details: updatedTask.details || '',
                dueDate: updatedTask.dueDate || new Date(), // Add properties as needed
            });
    
            console.log('Task updated successfully:', response.data);
            alert('Task edited successfully!');
        } catch (error) {
            console.error('Error editing task:', error);
            alert('Failed to edit the task.');
        }
    };
    
    const handleDelete = async () => {
        try {
            const response = await axios.delete(`${SERVER_URL}/${task.id}`);
            console.log('Task deleted successfully:', response.data);
            alert('Task deleted successfully!');
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Failed to delete the task.');
        }
    };


    return (
        <>
            <div
                ref={(node) => dragRef(dropRef(node))} key={task.id}
                className={`flex flex-col w-full h-fit ${isDragging ? 'opacity-50' : 'opacity-100'} bg-blue-200 rounded-lg shadow-lg p-4 my-2`}
            >
                <span className="pointer-events-none text-xl font-bold">{task.name}</span>
                <span className="pointer-events-none text-lg">{task.description}</span>
                <span className="pointer-events-none text-md mt-6">{task.createdAt.toDateString()}</span>
                <div className="flex flex-row w-full bottom-2 left-2 items-center justify-end">
                    <button
                        className="px-2 py-2 ml-2 rounded-md w-fit text-white bg-red-500 hover:bg-red-800"
                        onClick={() => { setType('delete'); setIsModalOpen(true); }}
                    >
                        Delete
                    </button>
                    <button
                        className="px-2 py-2 mx-2 rounded-md w-fit text-white bg-blue-400 hover:bg-blue-600"
                        onClick={() => { setType('edit'); setIsModalOpen(true); console.log(type, isModalOpen) }}
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
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    type={type}
                    modal={isModalOpen}
                />
            )}
        </>
    );
}
