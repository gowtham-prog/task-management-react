import { DndProvider, useDrag, useDrop } from 'react-dnd';
import Task from './task';
import noTask from '../assets/noTask.png';
const ItemType = {
    TASK: 'task',
};

export default function TaskContainer({ status, tasks, moveTask, triggerFetch}) { 
    const filteredTasks = tasks.filter((task) => task.status === status);

    const [, dropRef] = useDrop({
        accept: ItemType.TASK,
        drop(draggedItem) {
            console.log("dropped", draggedItem)
            if (draggedItem.currentStatus !== status) {
                moveTask(draggedItem.index, filteredTasks.length, status, draggedItem.currentStatus,draggedItem.id);
                draggedItem.currentStatus = status;
            }
        },
    });

    return (
        <div ref={dropRef} className="flex flex-col w-full md:w-1/3 min-h-[75vh] h-full items-center justify-start m-2 bg-white shadow-lg rounded-lg p-4">
            <div className="text-2xl flex p-2 w-full font-bold capitalize text-left bg-blue-400 mb-4 text-white">
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </div>
            {filteredTasks.length > 0 ? (
                filteredTasks.map((task, index) => (
                    <Task key={task.id} task={task} index={index} moveTask={moveTask} triggerFetch={triggerFetch}/>
                ))
            ) : (
                <div className='flex flex-col w-full h-full items-center justify-center'>
                    <div className='flex flex-col w-full h-fit items-center '>
                        <p className="text-gray-500 italic text-center">Drop tasks here</p>
                        <img src={noTask} alt="noTask" className="w-1/2 h-auto " />
                    </div>
                </div>
            )}
        </div>
    );
}