import React, { useEffect, useState } from 'react';
import { UserIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useProfiles } from '../../contexts/ProfilesContext';

function EditProfile({ open, onClose, profile }) {
  const { updateProfile } = useProfiles();

  const [error, setError] = useState('');
  const [fullName, setFullName] = useState('');
  const [course, setCourse] = useState('');
  const [yearLevel, setYearLevel] = useState('');
  const [email, setEmail] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  // Pre-fill the form with profile data
  useEffect(() => {
    if (open && profile) {
      setFullName(profile.fullName || '');
      setCourse(profile.course || '');
      setYearLevel(profile.yearLevel || '');
      setEmail(profile.email || '');
      setError('');
    }
  }, [open, profile]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  const handleUpdate = async () => {
    if (!fullName.trim() || !course.trim() || !yearLevel.trim() || !email.trim()) {
      setError('All fields are required.');
      return;
    }

    setIsLoading(true);
    try {
      const updatedProfile = {
        fullName: fullName.trim(),
        course: course.trim(),
        yearLevel: yearLevel.trim(),
        email: email.trim()
      };

      await updateProfile(profile.id, updatedProfile);
      toast.success('Profile updated successfully!');
      onClose();
    } catch (err) {
      console.error('Update failed:', err);
      toast.error('Failed to update profile.');
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="overlay border px-4 sm:px-7 min-h-[70vh] max-h-[85vh] flex flex-col justify-between border-gray-700 rounded-lg w-full max-w-3xl text-color"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{
              scale: 1,
              y: 0,
              opacity: 1,
              transition: {
                type: 'spring',
                damping: 25,
                stiffness: 300,
                mass: 0.5,
              },
            }}
            exit={{
              scale: 0.95,
              opacity: 0,
              transition: { duration: 0.15 },
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center py-4 border-gray-700">
              <h2 className="text-sm font-semibold">Edit Profile</h2>
              <motion.button
                onClick={onClose}
                className="text-gray-400 hover:text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X size={20} className="hover:bg-gray-700 rounded" />
              </motion.button>
            </div>

            {/* Body */}
            <div className="space-y-4 flex-1">
              <div className="p-1 bg-gray-700 rounded w-fit">
                <UserIcon size={20} className="text-gray-500" />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full overlay rounded text-color text-base bg-gray-800 placeholder-gray-500 px-3 py-2 focus:outline-none"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Course"
                  className="w-full overlay rounded text-color text-base bg-gray-800 placeholder-gray-500 px-3 py-2 focus:outline-none"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                />
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Year Level"
                  className="w-full overlay rounded text-color text-base bg-gray-800 placeholder-gray-500 px-3 py-2 focus:outline-none"
                  value={yearLevel}
                  onChange={(e) => setYearLevel(e.target.value)}
                />
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full overlay rounded text-color text-base bg-gray-800 placeholder-gray-500 px-3 py-2 focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

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
                className="px-4 py-1.5 text-sm font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-1.5 text-sm font-medium text-white accent-bg hover:bg-blue-500 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !fullName || !course || !yearLevel || !email}
              >
                {isLoading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default EditProfile;
