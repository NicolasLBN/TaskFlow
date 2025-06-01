import React from 'react';
import Navbar from '../utils/Navbar';
import ProjectCard from '../components/Card/ProjectCard';
import TaskList from '../components/List/TaskList';
import Dropdown from '../utils/Dropdown';
import UserCard from '../components/Card/UserCard';
import { useNavigate } from 'react-router-dom';
import { useHomePage } from '../hooks/useHomePage';

/**
 * HomePage component displaying user dashboard, projects, colleagues, and tasks.
 * Uses the useHomePage hook for all business logic and state.
 */
const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    userTasks,
    projects,
    userProjects,
    otherProjects,
    loading,
    selectedProject,
    setSelectedProject,
    selectedStatus,
    setSelectedStatus,
    peopleYouWorkWith,
    handleJoinProject,
    handleLeaveProject,
    handleGoToBoard,
    filteredUserTasks,
  } = useHomePage(navigate);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Navbar />
      <h1 className="text-4xl font-bold text-center my-8">
        {currentUser?.username.toUpperCase()} Dashboard
      </h1>

      {/* People you work with Section */}
      <div className="mx-auto max-w-6xl px-10 mb-12">
        <h2 className="text-3xl font-semibold text-left mb-4">People you work with</h2>
        <div className="flex flex-wrap gap-4">
          {peopleYouWorkWith.length > 0 ? (
            peopleYouWorkWith.map(person => (
              <UserCard
                key={person.id}
                username={person.username}
              />
            ))
          ) : (
            <p>No colleagues found.</p>
          )}
        </div>
      </div>

      {/* User Projects Section */}
      <div className="mx-auto max-w-6xl px-10">
        <h2 className="text-3xl font-semibold text-left mb-4">Your Projects</h2>
        <hr className="mb-8 border-t-2 border-gray-300" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {userProjects.length > 0 ? (
            userProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                members={project.users ?? []}
                onLeave={() => handleLeaveProject(project.id)}
                onGoToBoard={() => handleGoToBoard(project)}
              />
            ))
          ) : (
            <p>No projects available.</p>
          )}
        </div>
      </div>

      {/* Other Projects Section */}
      <div className="mx-auto max-w-6xl px-10 mt-12">
        <h2 className="text-3xl font-semibold text-left mb-4">Other Projects</h2>
        <hr className="mb-8 border-t-2 border-gray-300" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {otherProjects.length > 0 ? (
            otherProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                members={project.users ?? []}
                onJoin={() => handleJoinProject(project.id)}
              />
            ))
          ) : (
            <p>No other projects available.</p>
          )}
        </div>
      </div>

      {/* Task Section */}
      <div className="mx-auto max-w-6xl px-10 mt-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-semibold text-left">Your Tasks</h2>
          <div className="flex space-x-4">
            <Dropdown
              label="Sort by Project"
              options={[...userProjects.map((project) => project.name)]}
              selected={selectedProject}
              onChange={setSelectedProject}
            />
            <Dropdown
              label="Sort by Status"
              options={['todo', 'inProgress', 'done']}
              selected={selectedStatus}
              onChange={setSelectedStatus}
            />
          </div>
        </div>
        <hr className="mb-8 border-t-2 border-gray-300" />
        <div className="grid grid-cols-1 gap-6 mb-8">
          <TaskList userTasks={filteredUserTasks} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;