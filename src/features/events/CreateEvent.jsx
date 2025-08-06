import React, { useEffect, useState } from 'react';
import { BoxIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEvents } from '../../contexts/EventContext';
import { Input } from "@material-tailwind/react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'sonner';


function CreateEvent({ open, onClose }) {

  const { createEvent } = useEvents();
  const TITLE_MAX = 80;
  const SUMMARY_MAX = 255;
  const DESCRIPTION_MAX = 1000;
  
  const [error, setError] = useState('');
  const [projectName, setProjectName] = useState('');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [titleError, setTitleError] = useState('');
  const [summaryError, setSummaryError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [eventDateError, setEventDateError] = useState('');

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
      setEventDate('');
      setEventDateError('');
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

    if (!eventDate) {
      setEventDateError("Event date is required");
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time
      const inputDate = new Date(eventDate);
      if (inputDate < today) {
        setEventDateError("Event date cannot be in the past");
      } else {
        setEventDateError('');
      }
    }

    if (
      !titleError &&
      !summaryError &&
      !descriptionError &&
      !eventDateError && eventDate &&
      projectName.trim() !== '' &&
      projectName.length <= TITLE_MAX &&
      summary.length <= SUMMARY_MAX &&
      description.length <= DESCRIPTION_MAX
    ) {
      setIsLoading(true);
      try {
        const eventData = {
          name: projectName.trim(),
          summary: summary.trim(),
          description: description.trim(),
          date: eventDate
        };

        await createEvent(eventData); // ✅ Use EventContext instead of direct Firestore
        toast.success("Event created successfully!");
        onClose(); // Close modal
      } catch (err) {
        console.error('Error creating project:', err);
        setError('Failed to create project. Please try again.');
        toast.error("Failed to create event.");
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
          className="fixed inset-0 bg-black/40 backdrop-blur-md bg-opacity-50 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {onClose()}}
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
                        onClick={(e) => { onClose()}}
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
                        className="w-full overlay mb-0 rounded resize-none  text-color text-xl sm:text-2xl placeholder-gray-500 border-none focus:outline-none"
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
                    <div className="mb-0">
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
                    {/* Event Date Input */}
                    <div className="flex flex-col gap-1">
                      <ReactDatePicker
                        selected={eventDate ? new Date(eventDate) : null}
                        onChange={(date) => {
                          const selectedDate = date?.toISOString().split("T")[0];
                          setEventDate(selectedDate);

                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const inputDate = new Date(selectedDate);

                          if (!selectedDate) {
                            setEventDateError("Event date is required");
                          } else if (inputDate < today) {
                            setEventDateError("Event date cannot be in the past");
                          } else {
                            setEventDateError("");
                          }
                        }}
                        dateFormat="yyyy-MM-dd"
                        placeholderText="Select event date"
                        className="w-full overlay text-sm text-color placeholder-gray-500 bg-gray-800 border border-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 px-3 py-2 rounded"
                        minDate={new Date()}
                      />

                      {eventDateError && (
                        <span className="text-red-500 text-xs mt-1 flex justify-end">
                          {eventDateError}
                        </span>
                      )}
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
                        onClick={(e) => { onClose()}}
                        className="px-4 py-1.5 h-fit text-sm gap-2 font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        Cancel
                    </button>
                    <button
                      className="px-4 py-1.5 h-fit text-sm font-medium text-white accent-bg hover:bg-blue-500 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={(e) => { handleCreate()}}
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