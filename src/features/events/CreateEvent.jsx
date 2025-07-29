import React, { useEffect, useState } from 'react';
import { BoxIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { db } from '../../services/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';

function CreateEvent({ open, onClose }) {
  const { currentWorkspace } = useWorkspace();
  const { currentUser } = useAuth();


  const TITLE_MAX = 80;
  const SUMMARY_MAX = 255;
  const DESCRIPTION_MAX = 1000;
  
  const [error, setError] = useState('');
  const [projectName, setProjectName] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState('');
  const [summaryError, setSummaryError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open, onClose]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      setProjectName('');
      setSummary('');
      setDescription('');
      setTitleError('');
      setSummaryError('');
      setDescriptionError('');
    }
  }, [open]);

  const validateTitle = (value) => {
    if (value.length > TITLE_MAX) {
      setTitleError(`Title must be ${TITLE_MAX} characters or less`);
    } else {
      setTitleError('');
    }
  };

  const validateSummary = (value) => {
    if (value.length > SUMMARY_MAX) {
      setSummaryError(`Summary must be ${SUMMARY_MAX} characters or less`);
    } else {
      setSummaryError('');
    }
  };

  const validateDescription = (value) => {
    if (value.length > DESCRIPTION_MAX) {
      setDescriptionError(`Description must be ${DESCRIPTION_MAX} characters or less`);
    } else {
      setDescriptionError('');
    }
  };

  const handleCreate = async () => {
    validateTitle(projectName);
    validateSummary(summary);
    validateDescription(description);

    if (
      !titleError &&
      !summaryError &&
      !descriptionError &&
      projectName.trim() !== '' &&
      projectName.length <= TITLE_MAX &&
      summary.length <= SUMMARY_MAX &&
      description.length <= DESCRIPTION_MAX
    ) {
      setIsLoading(true);
      try {
        // Reference to the workspace's project subcollection
        const projectsRef = collection(db, 'workspaces', currentWorkspace.id, 'events');

        await addDoc(projectsRef, {
          name: projectName.trim(),
          summary: summary.trim(),
          description: description.trim(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          createdBy: {
            uid: currentUser?.uid || null,
            name: currentUser?.name || 'Unknown',
          },
        });

        onClose(); // Close modal after successful creation
      } catch (err) {
        console.error('Error creating project:', err);
        setError('Failed to create project. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      setError('Please fix validation errors');
    }
  };



  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-transparent bg-opacity-50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
            <motion.div
              className="overlay border  px-4 sm:px-7 min-h-[85vh] max-h-[85vh] flex flex-col justify-between border-gray-700 rounded-lg w-full max-w-4xl text-color"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{
              scale: 1,
              y: 0,
              opacity: 1,
              transition: {
                  type: "spring",
                  damping: 25,
                  stiffness: 300,
                  mass: 0.5
              }
              }}
              exit={{
              scale: 0.95,
              opacity: 0,
              transition: { duration: 0.15 }
              }}
              onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center py-4  border-gray-700">
                    <h2 className="text-sm font-semibold">Create Event</h2>
                    <motion.button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <X size={20} className='hover:bg-gray-700 rounded'/>
                    </motion.button>
                </div>
                
                {/* Body */}
                <div className="space-y-2 sm:space-y-3 flex-1">
                    {/* Event Icon */}
                    <div className='p-1 bg-gray-700 rounded w-fit'><BoxIcon size={20} className='text-gray-500'/></div>
                    {/* Event Name */}
                    <div>
                        <textarea
                        rows={1}
                        type="text"
                        maxLength={TITLE_MAX + 1}
                        placeholder="Event name"
                        className="w-full overlay rounded resize-none  text-color text-xl sm:text-2xl placeholder-gray-500 border-none focus:outline-none"
                        value={projectName}
                        onChange={(e) => {
                          setProjectName(e.target.value);
                          validateTitle(e.target.value);
                        }}
                        />
                        <div className="flex justify-between">
                          {titleError && (
                            <span className="text-red-500 text-xs">{titleError}</span>
                          )}
                        </div>
                    </div>
                    {/* Short Summary */}
                    <div>
                        <textarea
                        rows={2}
                        maxLength={SUMMARY_MAX + 1}
                        type="text"
                        placeholder="Add a short summary"
                        className="w-full overlay resize-none rounded text-color text-sm sm:text-md placeholder-gray-500 border-none focus:outline-none"
                        value={summary}
                        onChange={(e) => {
                          setSummary(e.target.value);
                          validateSummary(e.target.value);
                        }}
                        />
                        <div className="flex justify-between">
                          {summaryError && (
                            <span className="text-red-500 text-xs">{summaryError}</span>
                          )}
                        </div>
                    </div>
                    {/* Attributes */}
                    <div className='h-5'>

                    </div>
                    <div className="border-t border-gray-700 my-4"></div>
                    {/* Description Editor */}
                    <div className="flex-1">
                        <textarea
                        rows={window.innerWidth < 640 ? 12 : 10}
                        maxLength={DESCRIPTION_MAX + 1}
                        placeholder="Write a description, a project brief, or collect ideas ... "
                        className="w-full  resize-none overlay rounded text-color text-sm sm:text-md placeholder-gray-500 border-none focus:outline-none"
                        value={description}
                        onChange={(e) => {
                          setDescription(e.target.value);
                          validateDescription(e.target.value);
                        }}
                        />
                        <div className="flex justify-between mt-1">
                          {descriptionError && (
                            <span className="text-red-500 text-xs">{descriptionError}</span>
                          )}
                          <span className={`text-xs ml-auto ${
                            description.length > DESCRIPTION_MAX ? 'text-red-500' : 'text-gray-500'
                          }`}>
                            {description.length}/{DESCRIPTION_MAX}
                          </span>
                        </div>
                    </div>

                    {/* Global Error */}
                    {error && (
                      <div className="text-red-500 text-sm text-center p-2 bg-red-500/10 rounded">
                        {error}
                      </div>
                    )}
                </div>
                {/* Footer */}
                <div className="py-4 flex gap-2 border-t border-gray-700 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 h-fit text-sm gap-2 font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        Cancel
                    </button>
                    <button
                      className="px-4 py-1.5 h-fit text-sm font-medium text-white accent-bg hover:bg-blue-500 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleCreate}
                      disabled={
                        isLoading ||
                        !projectName.trim() ||
                        titleError ||
                        summaryError ||
                        descriptionError
                      }
                    >
                      {isLoading ? 'Creating...' : 'Create Event'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CreateEvent;