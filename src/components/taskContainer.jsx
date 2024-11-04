import { DndProvider, useDrag, useDrop } from 'react-dnd';
import Task from './task';

const ItemType = {
    TASK: 'task',
};

export default function TaskContainer({ status, tasks, moveTask }) {
    const filteredTasks = tasks.filter((task) => task.status === status);

    const [, dropRef] = useDrop({
        accept: ItemType.TASK,
        drop(draggedItem) {
            // Handle dropping into an empty container or a new container
            if (draggedItem.currentStatus !== status) {
                moveTask(draggedItem.index, filteredTasks.length, status, draggedItem.currentStatus);
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
                    <Task key={task.id} task={task} index={index} moveTask={moveTask} />
                ))
            ) : (
                <p className="text-gray-500 italic">Drop tasks here</p>
            )}
        </div>
    );
}