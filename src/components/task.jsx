import { DndProvider, useDrag, useDrop } from 'react-dnd';

const ItemType = {
    TASK: 'task',
};

export default function Task({ task, index, moveTask }) {
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
            // Reordering within the same container
            if (draggedItem.currentStatus === task.status && draggedItem.index !== index) {
                moveTask(draggedItem.index, index, task.status);
                draggedItem.index = index; // Update the index for the dragged item
            }
        },
    });

    return (
        <div
            ref={(node) => dragRef(dropRef(node))}
            className={`flex flex-col w-full h-fit ${isDragging ? 'opacity-50' : 'opacity-100'} bg-blue-200 rounded-lg shadow-lg p-4 my-2`}
        >
            <span className="pointer-events-none text-xl font-bold">{task.content}</span>
            <span className="pointer-events-none text-lg">Description</span>
            <span className="pointer-events-none text-md mt-6">created at</span>
            <div className="flex flex-row w-full bottom-2 left-2 items-center justify-end">
                <button className="px-2 py-2 ml-2 rounded-md w-fit text-white bg-red-500 hover:bg-red-800" onClick={() => console.log('Delete')}>Delete</button>
                <button className="px-2 py-2 mx-2 rounded-md w-fit text-white bg-blue-400 hover:bg-blue-600" onClick={() => console.log('Edit')}>Edit</button>
                <button className="px-2 py-2 rounded-md w-fit text-white bg-blue-600 hover:bg-blue-900" onClick={() => console.log('View Details')}>View Details</button>
            </div>
        </div>
    );
}
