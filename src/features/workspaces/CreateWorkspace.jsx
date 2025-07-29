import React, { useState, useEffect } from 'react';
import { CaretLeft } from 'phosphor-react';
import { useAuth } from '../../contexts/AuthContext';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase';

function CreateWorkspace() {
  const { currentUser, logout } = useAuth();
  const { createWorkspace, isLoading } = useWorkspace();
  const navigate = useNavigate();

  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceURL, setWorkspaceURL] = useState('');
  const [error, setError] = useState('');
  const debouncedURL = useDebounce(workspaceURL, 500);

  useEffect(() => {
    const slug = workspaceName.trim().toLowerCase().replace(/\s+/g, '-');
    setWorkspaceURL(`${slug}`);
  }, [workspaceName]);

  useEffect(() => {
    const checkURL = async () => {
      if (!debouncedURL) return;
      const fullURL = `attendance-tracker/${debouncedURL}`;
      const q = query(collection(db, 'workspaces'), where('url', '==', fullURL));
      const snapshot = await getDocs(q);
      if (!debouncedURL.trim()) {
        setError('Workspace URL is required.');
      } else if (!/^[a-z0-9-]+$/.test(debouncedURL)) {
        setError('Only lowercase letters, numbers, and hyphens are allowed.');
      } else if (!snapshot.empty) {
        setError('This workspace URL is already taken.');
      } else {
        setError('');
      }
    };
    checkURL();
  }, [debouncedURL]);

  // ✅ Use context function for workspace creation
  const handleCreateWorkspace = async () => {
    if (!workspaceName || !workspaceURL || !currentUser || error) return;
    try {
      await createWorkspace({
        name: workspaceName,
        url: workspaceURL,
      });
      navigate(`/attendance-tracker/${workspaceURL}`);
    } catch (err) {
      console.error('Failed to create workspace:', err);
    }
  };

  return (
    <div className='flex flex-col h-[90vh] overflow-y-auto primary'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 sm:px-10 py-3 w-full h-auto mb-4 gap-4 sm:gap-0'>
        <div className='flex items-center gap-1'>
          <CaretLeft size={16} className='text-white cursor-pointer' />
          {currentUser.workspaceURL ? (
            <a href='/attendance-tracker' className='text-color-secondary text-xs font-semibold'>Back to Attendance Tracker</a>
          ) : (
            <a onClick={logout} className="text-color-secondary text-xs font-semibold cursor-pointer">Logout</a>
          )}
        </div>
        <div className='flex flex-col items-end sm:items-start gap-1 ml-auto'>
          <p className='text-color-secondary text-xs font-semibold'>Logged in as</p>
          <p className='text-color text-xs font-semibold break-all'>{currentUser?.email}</p>
        </div>
      </div>

      {/* Body */}
      <div className='flex justify-center items-center px-4 sm:px-10 w-full h-full'>
        <div className='flex flex-col items-center gap-5 w-full max-w-md h-full'>
          <div className='flex flex-col justify-center items-center gap-4 text-center'>
            <p className='text-color text-2xl font-semibold'>Create a new workspace</p>
            <p className='text-color-secondary text-sm font-semibold'>
              Workspaces are shared environments where teams collaborate on events and get things done.
            </p>
          </div>

          <div className='secondary flex flex-col justify-center items-center gap-5 w-full rounded-lg'>
            <form className='flex flex-col gap-5 w-full p-4 sm:p-10' onSubmit={(e) => e.preventDefault()}>
              <div className='flex flex-col items-start gap-2 w-full'>
                <label htmlFor="workspaceName" className='text-color text-sm font-semibold'>Workspace Name</label>
                <input
                  type="text"
                  id='workspaceName'
                  placeholder='Enter your workspace name'
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className='secondary border border-gray-700 w-full h-10 px-3 rounded-md text-color-secondary text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div className='flex flex-col items-start gap-2 w-full mt-4'>
                <label htmlFor="workspaceURL" className='text-color text-sm font-semibold'>Workspace URL</label>
                <div className='flex items-center w-full'>
                  <span className='secondary whitespace-nowrap text-color-secondary border border-gray-700 border-r-0 h-10 pl-3 rounded-l-md text-xs font-semibold flex items-center'>
                    attendance-tracker/
                  </span>
                  <input
                    type="text"
                    id='workspaceURL'
                    placeholder='your-workspace-name'
                    value={workspaceURL}
                    onChange={(e) => setWorkspaceURL(e.target.value.replace(/\s+/g, '-').toLowerCase())}
                    className='secondary border border-gray-700 border-l-0 w-full h-10 pr-3 rounded-r-md text-color-secondary text-xs font-semibold outline-none'
                  />
                </div>
                {error && <p className='error-text text-xs font-medium mt-1'>{error}</p>}
              </div>

              <div className='flex flex-col items-start gap-2 w-full mt-4'>
                <p className='text-color-secondary text-center w-full text-sm font-semibold'>
                  By creating a workspace, you agree to our <span className='accent-text cursor-pointer'>Terms of Service</span>
                </p>
              </div>
            </form>
          </div>

          <button
            onClick={handleCreateWorkspace}
            disabled={!workspaceName || isLoading || !!error}
            className='accent-bg text-white cursor-pointer w-full max-w-xs flex items-center justify-center gap-3 py-2.5 px-4 rounded-md font-medium hover:bg-opacity-90 transition-colors mt-4 disabled:opacity-60'
          >
            <span className='text-sm'>
              {isLoading ? 'Creating...' : 'Create Workspace'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateWorkspace;
