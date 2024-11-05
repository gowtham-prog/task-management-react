import React, { useEffect, useState, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Layout from '../components/layout';
import TaskContainer from '../components/taskContainer';
import { useAuthentication } from '../Authentication';
import AddTask from '../components/addTask';
import Task from '../components/task';

function TaskManagement() {
  const [authenticated, setAuthenticated] = useState(null);
  const { isAuthenticated } = useAuthentication();

  useEffect(() => {
    const checkAuthentication = async () => {
      const result = await isAuthenticated();
      setAuthenticated(result);
    };

    checkAuthentication();
  }, [isAuthenticated]);

  useEffect(() => {
    if (authenticated === false) {
      window.location.href = '/login';
    }
  }, [authenticated]);

  // const [tasks, setTasks] = useState([
  //   { id: '1', content: 'Task 1', status: 'pending' },
  //   { id: '2', content: 'Task 2', status: 'pending' },
  //   { id: '3', content: 'Task 3', status: 'running' },
  //   { id: '4', content: 'Task 4', status: 'completed' },
  // ]);
  const initialTasks = [
    {
      id: '1',
      user: '64d1f0a2c9e77b00127f6312', // Example ObjectId reference
      name: 'Project Research',
      description: 'Research and compile data for project analysis.',
      details: 'Compile relevant data sources and prepare a presentation.',
      createdAt: new Date('2024-10-25T08:30:00Z'),
      dueDate: new Date('2024-11-10T17:00:00Z'),
      status: 'todo',
    },
    {
      id: '2',
      user: '64d1f0a2c9e77b00127f6312',
      name: 'Team Meeting Preparation',
      description: 'Organize slides and talking points for the meeting.',
      details: 'Ensure all team updates are included in the slides.',
      createdAt: new Date('2024-10-26T10:00:00Z'),
      dueDate: new Date('2024-11-05T09:00:00Z'),
      status: 'todo',
    },
    {
      id: '3',
      user: '64d1f0a2c9e77b00127f6313',
      name: 'Code Review',
      description: 'Review recent code submissions for project B.',
      details: 'Focus on performance optimization and code quality.',
      createdAt: new Date('2024-10-27T12:15:00Z'),
      dueDate: new Date('2024-11-06T12:00:00Z'),
      status: 'inprogress',
    },
    {
      id: '4',
      user: '64d1f0a2c9e77b00127f6314',
      name: 'Documentation Update',
      description: 'Update project documentation to reflect the latest changes.',
      details: 'Make sure to include API changes and new feature details.',
      createdAt: new Date('2024-10-29T15:45:00Z'),
      dueDate: new Date('2024-11-15T18:00:00Z'),
      status: 'done',
    },
  ]
  const [tasks, setTasks] = useState(initialTasks);
  const [showfilteredTasks, setShowFilteredTasks] = useState(false);

  const moveTask = (fromIndex, toIndex, newStatus, oldStatus = newStatus) => {
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];
      const fromList = updatedTasks.filter((task) => task.status === oldStatus);
      const toList = updatedTasks.filter((task) => task.status === newStatus);

      if (fromIndex >= fromList.length || fromIndex < 0) {
        console.error('Invalid fromIndex:', fromIndex);
        return prevTasks;
      }

      const [movedTask] = fromList.splice(fromIndex, 1);

      if (!movedTask) {
        console.error('Task to move not found');
        return prevTasks;
      }

      movedTask.status = newStatus;

      if (oldStatus === newStatus) {
        fromList.splice(toIndex, 0, movedTask);
      } else {
        toList.splice(toIndex, 0, movedTask);
      }

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

  const [originalTasks] = useState(initialTasks);
  const [filteredTasks, setFilteredTasks] = useState(initialTasks);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    sortTasks(option);
    setIsOpen(false);
  };

  useEffect(() => {
    const filteredTasks = originalTasks.filter(task =>
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredTasks(filteredTasks);
  }, [searchQuery, originalTasks]);

  const sortTasks = (option) => {
    let sortedTasks;
    if (option === 'todo') {
      sortedTasks = originalTasks.filter(task => task.status.toLowerCase() === 'todo');
    } else if (option === 'inprogress') {
      sortedTasks = originalTasks.filter(task => task.status.toLowerCase() === 'inprogress');
    } else if (option === 'done') {
      sortedTasks = originalTasks.filter(task => task.status.toLowerCase() === 'done');
    } else {
      sortedTasks = originalTasks; // No sorting applied if none selected
    }

    console.log("sorted", sortedTasks);
    setFilteredTasks(sortedTasks);
    setShowFilteredTasks(true);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const [addTask, setAddTask] = useState(false);
  const toggleAddTask = () => {
    setAddTask((task) => !task);
  };

  const addTaskRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (addTask && addTaskRef.current && !addTaskRef.current.contains(event.target)) {
        setAddTask(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [addTask]);


  return (
    <DndProvider backend={HTML5Backend}>

      <Layout>
        <div className="flex flex-col justify-start w-full h-full max-w-7xl">
          <button onClick={() => toggleAddTask()} className="px-10 py-2 m-2 rounded-md w-fit text-white bg-blue-600 hover:text-blue-600 hover:bg-white">
            Add Task
          </button>
          <div className="flex flex-row shadow-lg bg-white p-2 m-2 rounded-lg justify-between items-center w-full">
            <div className="flex flex-row items-center justify-start w-1/3">
              <span className="text-lg font-sans font-semibold">Search</span>
              <input
                type="text"
                placeholder="Search..."
                className="border border-gray-300 rounded-md p-2 m-2 w-full"
                value={searchQuery}
                onChange={handleSearchChange}
              />
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
                          onClick={() => handleOptionClick('todo')}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          To do
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleOptionClick('inprogress')}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          In progress
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => handleOptionClick('done')}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Done
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {showfilteredTasks ? (
            <div>
              <div className='text-2xl cursor-pointer' onClick={() => setShowFilteredTasks(false)}>Back</div>
              <div className="flex flex-col w-full h-full items-center justify-start m-2 bg-white shadow-lg rounded-lg p-4">
                <div className="text-2xl flex p-2 w-full font-bold capitalize text-left bg-blue-400 mb-4 text-white">
                  {selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1)}
                </div>

                {filteredTasks.map((task,index) => (
                  <Task key={task.id} task={task} index={index} moveTask={moveTask} />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-row w-full items-center justify-center m-2">
              <TaskContainer status="todo" tasks={tasks} moveTask={moveTask} />
              <TaskContainer status="inprogress" tasks={tasks} moveTask={moveTask} />
              <TaskContainer status="done" tasks={tasks} moveTask={moveTask} />
            </div>
          )}


          {addTask &&
            <div className='z-40 flex items-center justify-center w-full h-full bg-black bg-opacity-50 backdrop-blur-md fixed inset-0'>
              <AddTask ref={addTaskRef} closeModal={toggleAddTask} />
            </div>
          }

        </div>
      </Layout>
    </DndProvider>
  );
}

export default TaskManagement;
