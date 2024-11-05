import React, { useEffect, useState, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Layout from '../components/layout';
import TaskContainer from '../components/taskContainer';
import { useAuthentication } from '../Authentication';
import AddTask from '../components/addTask';
import Task from '../components/task';
import axios from 'axios';
import { SERVER_URL } from '../config';
import back from '../assets/back.svg';


function TaskManagement() {
  const [authenticated, setAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const { isAuthenticated } = useAuthentication();
  const [loading, setLoading] = useState(false);

  // Effect to check authentication on component mount
  useEffect(() => {
    const checkAuthentication = async () => {
      const result = await isAuthenticated();
      setAuthenticated(result);

      if (result) {
        const token = localStorage.getItem('accessToken');
        setAccessToken(token);
      } else {
        window.location.href = '/login'; // Redirect to login if not authenticated
      }
    };

    checkAuthentication();
  }, [isAuthenticated]);

  // const fetchTasks = () => {
  //   console.log("fetching...")
  // }
  const fetchTasks = async () => {
    setLoading(true);
    try {
      if (accessToken) {
        const response = await axios.get(`${SERVER_URL}/task/all`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log('Fetched tasks:', response.data);
        const formattedTasks = response.data?.tasks.map(task => ({
          ...task,
          date: task.date ? new Date(task.date).toLocaleDateString() : 'N/A',
        }));

        setTasks(formattedTasks);
        setOriginalTasks(formattedTasks);
      } else {
        console.error("Access token is missing");
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authenticated && accessToken) {
      fetchTasks();
    }
  }, [authenticated, accessToken]);


  // const initialTasks = [
  //   {
  //     id: '1',
  //     user: '64d1f0a2c9e77b00127f6312', // Example ObjectId reference
  //     name: 'Project Research',
  //     description: 'Research and compile data for project analysis.',
  //     details: 'Compile relevant data sources and prepare a presentation.',
  //     createdAt: new Date('2024-10-25T08:30:00Z'),
  //     dueDate: new Date('2024-11-10T17:00:00Z'),
  //     status: 'todo',
  //   },
  //   {
  //     id: '2',
  //     user: '64d1f0a2c9e77b00127f6312',
  //     name: 'Team Meeting Preparation',
  //     description: 'Organize slides and talking points for the meeting.',
  //     details: 'Ensure all team updates are included in the slides.',
  //     createdAt: new Date('2024-10-26T10:00:00Z'),
  //     dueDate: new Date('2024-11-05T09:00:00Z'),
  //     status: 'todo',
  //   },
  //   {
  //     id: '3',
  //     user: '64d1f0a2c9e77b00127f6313',
  //     name: 'Code Review',
  //     description: 'Review recent code submissions for project B.',
  //     details: 'Focus on performance optimization and code quality.',
  //     createdAt: new Date('2024-10-27T12:15:00Z'),
  //     dueDate: new Date('2024-11-06T12:00:00Z'),
  //     status: 'inprogress',
  //   },
  //   {
  //     id: '4',
  //     user: '64d1f0a2c9e77b00127f6314',
  //     name: 'Documentation Update',
  //     description: 'Update project documentation to reflect the latest changes.',
  //     details: 'Make sure to include API changes and new feature details.',
  //     createdAt: new Date('2024-10-29T15:45:00Z'),
  //     dueDate: new Date('2024-11-15T18:00:00Z'),
  //     status: 'done',
  //   },
  // ]
  const [tasks, setTasks] = useState([]);
  const [showfilteredTasks, setShowFilteredTasks] = useState(false);

  const moveTask = async (fromIndex, toIndex, newStatus, oldStatus = newStatus, taskId) => {
    let movedTask = null;
    console.log("moving task", fromIndex, toIndex, newStatus, oldStatus, taskId)

    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks];
      const fromList = updatedTasks.filter((task) => task.status === oldStatus);
      const toList = updatedTasks.filter((task) => task.status === newStatus);

      if (fromIndex >= fromList.length || fromIndex < 0) {
        console.error('Invalid fromIndex:', fromIndex);
        return prevTasks;
      }

      [movedTask] = fromList.splice(fromIndex, 1);

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

    if (movedTask) {
      try {
        await axios.patch(`${SERVER_URL}/task/updateStatus/${taskId}`, {
          status: newStatus,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        console.log(`Task ${taskId} successfully updated on the server.`);
      } catch (error) {
        console.error('Failed to update task on the server:', error);
      }
    }
  };


  const [originalTasks, setOriginalTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [searchQuery, setSearchQuery] = useState('');


  // const handleSearchChange = (event) => {
  //   setSearchQuery(event.target.value);
  // };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    sortTasks(option);
    setIsOpen(false);
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTasks(originalTasks);
      setShowFilteredTasks(false); 
      return;
    } 

    const filteredTasks = originalTasks.filter(task =>
      task.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setFilteredTasks(filteredTasks);
    setShowFilteredTasks(true);
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
      sortedTasks = originalTasks;
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

  const createTask = async (formData) => {
    console.log("creating task", formData);
    try {
      const response = await axios.post(`${SERVER_URL}/task/create/`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (response.status === 201) {
        console.log(`Task successfully created on the server.`);
        fetchTasks();
      } else {
        throw new Error('Failed to create task on the server.');
      }

    } catch (error) {
      console.error('Failed to create task on the server:', error);
    }
    toggleAddTask();
  }

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
                onChange={e=>setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex flex-row items-center justify-start">
              <span className="text-lg font-sans font-semibold capitalize">Sort By:</span>
              <div className="w-fit relative flex flex-col">
                <button
                  id="dropdownDefaultButton"
                  onClick={toggleDropdown}
                  className="text-black capitalize p-2 m-2 outline outline-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center"
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
              <div className='flex flex-row items-center justify-start text-lg font-bold cursor-pointer' onClick={() => setShowFilteredTasks(false)}>
                <img src={back} alt="back" className="w-8 h-auto" />
                <span className='ml-2'>Back</span>
              </div>
              <div className="flex flex-col w-full h-full items-center justify-start m-2 bg-white shadow-lg rounded-lg p-4">
                <div className="text-2xl flex p-2 w-full font-bold capitalize text-left bg-blue-400 mb-4 text-white">
                  {selectedOption.charAt(0).toUpperCase() + selectedOption.slice(1)}
                </div>

                {filteredTasks.map((task, index) => (
                  <Task key={task.id} task={task} index={index} moveTask={moveTask} triggerFetch={() => fetchTasks()} />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row w-full items-center justify-center m-2">
              <TaskContainer status="todo" tasks={tasks} moveTask={moveTask} triggerFetch={() => fetchTasks()} />
              <TaskContainer status="inprogress" tasks={tasks} moveTask={moveTask} triggerFetch={() => fetchTasks()} />
              <TaskContainer status="done" tasks={tasks} moveTask={moveTask} triggerFetch={() => fetchTasks()} />
            </div>
          )}


          {addTask &&
            <div className='z-40 flex items-center justify-center w-full h-full bg-black bg-opacity-50 backdrop-blur-md fixed inset-0'>
              <AddTask ref={addTaskRef} closeModal={toggleAddTask} createTask={createTask} />
            </div>
          }

          {loading && <div class="z-40 flex items-center justify-center w-full h-full bg-black bg-opacity-40 backdrop-blur-md fixed inset-0">
            <div role="status" class="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2">
              <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" /><path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" /></svg>
              <span class="sr-only">Loading...</span>
            </div>
          </div>}

        </div>
      </Layout>
    </DndProvider>
  );
}

export default TaskManagement;
