import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const DashboardWrapper = styled.div`
  display: flex;
  height: 100vh;
`;

const Sidebar = styled.div`
  width: 260px;
  background-color: #2c2c2c;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 50px;
`;

const NavItem = styled.a`
  font-size: 18px;
  margin-bottom: 20px;
  text-decoration: none;
  color: #aaa;
  padding: 10px 0;
  cursor: pointer;

  &:hover {
    color: white;
    background-color: #0070f3;
    border-radius: 8px;
    padding-left: 10px;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 40px;
  background-color: #f9f9f9;
`;

const ProjectsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 32px;
  color: #333;
`;

const ActionButton = styled.button`
  padding: 10px 20px;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-left: 15px;

  &:hover {
    background-color: #005bb5;
  }
`;

const Form = styled.form`
  background-color: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  margin-bottom: 15px;
  padding: 12px;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-size: 16px;
`;

const TextArea = styled.textarea`
  margin-bottom: 15px;
  padding: 12px;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  font-size: 16px;
`;

const FinishButton = styled.button`
  padding: 12px 20px;
  background-color: #333;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #000;
  }
`;

const TaskCard = styled.div`
  background-color: #fff;
  padding: 20px;
  margin: 20px 0;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TimerSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TimerButton = styled.button`
  margin-top: 10px;
  padding: 5px 10px;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #005bb5;
  }
`;

const TimerDisplay = styled.div`
  font-size: 20px;
  margin-bottom: 10px;
`;

const Dashboard = () => {
  const [projects, setProjects] = useState([]); 
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [teamMembers, setTeamMembers] = useState('');
  const [selectedProject, setSelectedProject] = useState(null); 
  const [newProjectName, setNewProjectName] = useState(''); 

  const [timers, setTimers] = useState({}); 
  const [intervals, setIntervals] = useState({}); 

  const handleAddProject = () => {
    const newProject = {
      id: Date.now(),
      name: newProjectName,
      teamMembers: [],
    };
    setProjects([...projects, newProject]);
    setNewProjectName(''); 
  };

  const handleJoinProject = (projectId) => {
    const updatedProjects = projects.map((project) => {
      if (project.id === projectId) {
        return { ...project, teamMembers: [...project.teamMembers, 'You'] };
      }
      return project;
    });
    setProjects(updatedProjects);
    setSelectedProject(projectId); 
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!selectedProject) {
      alert('Please join a project first!');
      return;
    }

    const newTask = {
      id: Date.now(),
      projectId: selectedProject,
      title: taskTitle,
      description: taskDescription,
      teamMembers,
    };

    setTasks([...tasks, newTask]);
    setTimers({ ...timers, [newTask.id]: 0 }); 
    setTaskTitle('');
    setTaskDescription('');
    setTeamMembers('');
  };

  const startTimer = (taskId) => {
    if (intervals[taskId]) return; // If already running, do nothing

    const intervalId = setInterval(() => {
      setTimers((prev) => ({
        ...prev,
        [taskId]: prev[taskId] + 1,
      }));
    }, 1000);

    setIntervals((prev) => ({ ...prev, [taskId]: intervalId }));
  };

  const stopTimer = (taskId) => {
    clearInterval(intervals[taskId]);
    setIntervals((prev) => ({ ...prev, [taskId]: null }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <DashboardWrapper>
      <Sidebar>
        <Logo>Task Tracker</Logo>
        <NavItem>Dashboard</NavItem>
        <NavItem>Projects</NavItem>
        <NavItem>Settings</NavItem>
        <NavItem>Help & Information</NavItem>
        <NavItem>Logout</NavItem>
      </Sidebar>

      <ContentArea>
        <ProjectsHeader>
          <Title>Projects</Title>
          <div>
            <Input
              type="text"
              placeholder="New Project"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
            />
            <ActionButton onClick={handleAddProject}>Add Project</ActionButton>
          </div>
        </ProjectsHeader>

        <h2>Available Projects</h2>
        {projects.map((project) => (
          <div key={project.id}>
            <h3>{project.name}</h3>
            <p>Team Members: {project.teamMembers.join(', ')}</p>
            {project.teamMembers.includes('You') ? (
              <span>You have joined this project</span>
            ) : (
              <ActionButton onClick={() => handleJoinProject(project.id)}>
                Join Project
              </ActionButton>
            )}
          </div>
        ))}

        <Form onSubmit={handleAddTask}>
          <Input
            type="text"
            placeholder="Task Title"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
          <TextArea
            placeholder="Task Description"
            rows="5"
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
          ></TextArea>
          <Input
            type="text"
            placeholder="Assign to team members"
            value={teamMembers}
            onChange={(e) => setTeamMembers(e.target.value)}
          />
          <FinishButton type="submit">Add Task</FinishButton>
        </Form>

        <h2>Tasks for Selected Project</h2>
        {tasks
          .filter((task) => task.projectId === selectedProject)
          .map((task) => (
            <TaskCard key={task.id}>
              <div>
                <h3>{task.title}/</h3>
                <p>{task.description}</p>
                <p>Team Members: {task.teamMembers}</p>
              </div>
            </TaskCard>
          ))}
      </ContentArea>
    </DashboardWrapper>
  );
};

export default Dashboard;

