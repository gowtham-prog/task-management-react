import React, { useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Layout from '../components/layout';
import TaskContainer from '../components/taskContainer';

function TaskManagement() {

  const authenticated = localStorage.getItem('authenticated');

  const [tasks, setTasks] = useState([
    { id: '1', content: 'Task 1', status: 'pending' },
    { id: '2', content: 'Task 2', status: 'pending' },
    { id: '3', content: 'Task 3', status: 'running' },
    { id: '4', content: 'Task 4', status: 'completed' },
  ]);

  const moveTask = (fromIndex, toIndex, newStatus, oldStatus = newStatus) => {
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];
      const fromList = updatedTasks.filter((task) => task.status === oldStatus);
      const toList = updatedTasks.filter((task) => task.status === newStatus);

      // Ensure valid indices before splicing
      if (fromIndex >= fromList.length || fromIndex < 0) {
        console.error('Invalid fromIndex:', fromIndex);
        return prevTasks; // Return current state without modification if index is invalid
      }

      const [movedTask] = fromList.splice(fromIndex, 1);

      if (!movedTask) {
        console.error('Task to move not found');
        return prevTasks; // Return current state without modification if task is undefined
      }

      movedTask.status = newStatus;

      if (oldStatus === newStatus) {
        fromList.splice(toIndex, 0, movedTask);
      } else {
        toList.splice(toIndex, 0, movedTask);
      }

      // Combine updated task lists
      return updatedTasks.map((task) => {
        if (task.status === oldStatus) {
          return fromList.shift() || task;
        } else if (task.status === newStatus) {
          return toList.shift() || task;
        }
        return task;
      });
    });
  };

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Dashboard');
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false); // Close the dropdown after an option is selected
    console.log(`Selected option: ${option}`); // Perform an action (e.g., log or trigger events)
  };
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <DndProvider backend={HTML5Backend}>

      <Layout>
        <div className="flex flex-col justify-start w-full h-full">
          <button className="px-5 py-2 m-2 rounded-md w-fit text-white bg-blue-600 hover:text-blue-600 hover:bg-white" onClick={() => console.log('hello Google')}>
            Add Task
          </button>
          <div className="flex flex-row shadow-lg bg-white p-2 m-2 rounded-lg justify-between items-center w-full">
            <div className="flex flex-row items-center justify-start w-1/3">
              <span className="text-lg font-sans font-semibold">Search</span>
              <input type="text" placeholder="Search..." className="border border-gray-300 rounded-md p-2 m-2 w-full" />
            </div>
            <div className="flex flex-row items-center justify-start">
              <span className="text-lg font-sans font-semibold">Sort By:</span>
              <div className="w-fit relative flex flex-col">
                <button
                  id="dropdownDefaultButton"
                  onClick={toggleDropdown}
                  className="text-black p-2 m-2 outline outline-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
                  type="button"
                >
                  {selectedOption}
                  <svg
                    className="w-2.5 h-2.5 ms-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </button>

                {isOpen && (
                  <div
                    id="dropdown"
                    className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 absolute top-10"
                  >
                    <ul className="py-2 text-sm text-black" aria-labelledby="dropdownDefaultButton">
                      <li>
                        <button
                          onClick={() => handleOptionClick('Dashboard')}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Dashboard
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleOptionClick('Settings')}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Settings
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleOptionClick('Earnings')}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Earnings
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleOptionClick('Sign out')}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Sign out
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-row w-full items-center justify-center m-2 ">
            <TaskContainer status="pending" tasks={tasks} moveTask={moveTask} />
            <TaskContainer status="running" tasks={tasks} moveTask={moveTask} />
            <TaskContainer status="completed" tasks={tasks} moveTask={moveTask} />
          </div>
        </div>
      </Layout>
    </DndProvider>
  );
}

export default TaskManagement;
