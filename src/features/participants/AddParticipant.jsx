import React, { useEffect, useState } from 'react';
import { BoxIcon, UserIcon, UserPlus2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from "@material-tailwind/react";
import { toast } from 'sonner';
import { useParticipants } from '../../contexts/ParticipantsContext';
import useDebounce from '../../hooks/useDebounce';
import { useProfiles } from '../../contexts/ProfilesContext';
import { doc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useWorkspace } from '../../contexts/WorkspaceContext';

function AddParticipant({ open, onClose, eventId  }) {
    const { addParticipant } = useParticipants();
    const { createProfile } = useProfiles();
    const { currentWorkspace } = useWorkspace();

    const FULLNAME_MAX = 100;

    const [IDNumber, setIDNumber] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const [collegeDepartment, setCollegeDepartment] = useState('');
    const [course, setCourse] = useState('');
    const [yearLevel, setYearLevel] = useState('');
    const [section, setSection] = useState('');

    const [collegeDepartmentError, setCollegeDepartmentError] = useState('');
    const [courseError, setCourseError] = useState('');
    const [yearLevelError, setYearLevelError] = useState('');
    const [sectionError, setSectionError] = useState('');

    const [IDNumberError, setIDNumberError] = useState('');
    const [firstNameError, setFirstNameError] = useState('');
    const [lastNameError, setLastNameError] = useState('');
    const [middleNameError, setMiddleNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [matchedProfile, setMatchedProfile] = useState(null);
    const debouncedID = useDebounce(IDNumber, 500);

    const { findProfileByIDNumber } = useParticipants();

    useEffect(() => {
        const fetchProfile = async () => {
            if (!debouncedID.trim()) {
                setMatchedProfile(null);
                return;
            }

            const profile = await findProfileByIDNumber(debouncedID);
            if (profile) {
                setMatchedProfile(profile);
            } else {
                setMatchedProfile(null);
            }
        };

        fetchProfile();
    }, [debouncedID, findProfileByIDNumber]);

  useEffect(() => {
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    if (open) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open]);

  useEffect(() => {
    if (!open) {
      setFirstName('');
      setLastName('');
      setMiddleName('');
      setEmail('');
      setPhone('');
      setCollegeDepartment('');
      setCourse('');
      setYearLevel('');
      setSection('');
      setFirstNameError('');
      setLastNameError('');
      setMiddleNameError('');
      setEmailError('');
      setPhoneError('');
      setCollegeDepartmentError('');
      setCourseError('');
      setYearLevelError('');
      setSectionError('');
      setError('');
    }
  }, [open]);

  const validateFields = () => {
    let isValid = true;

    if (firstName.length > FULLNAME_MAX) {
      setFirstNameError(`Max ${FULLNAME_MAX} characters`);
      isValid = false;
    } else {
      setFirstNameError('');
    }

    if (lastName.length > FULLNAME_MAX) {
      setLastNameError(`Max ${FULLNAME_MAX} characters`);
      isValid = false;
    } else {
      setLastNameError('');
    }

    if (!email.trim()) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Invalid email format');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!phone.trim()) {
      setPhoneError('Phone number is required');
      isValid = false;
    } else if (!/^\d{11}$/.test(phone)) {
      setPhoneError('Invalid phone number format');
      isValid = false;
    } else {
      setPhoneError('');
    }

    if (!collegeDepartment.trim()) {
        setCollegeDepartmentError('Department is required');
        isValid = false;
    } else {
        setCollegeDepartmentError('');
    }

    if (!course.trim()) {
        setCourseError('Course is required');
        isValid = false;
    } else {
        setCourseError('');
    }

    if (!yearLevel.trim()) {
        setYearLevelError('Year level is required');
        isValid = false;
    } else {
        setYearLevelError('');
    }

    if (!section.trim()) {
        setSectionError('Section is required');
        isValid = false;
    } else {
        setSectionError('');
    }


    if (firstNameError || lastNameError || middleNameError || emailError || phoneError) {
      isValid = false;
    }

    return isValid;
  };

  const handleAdd = async () => {
    if (!validateFields()) {
      setError('Please fix the errors');
      return;
    }

    setIsLoading(true);
    try {
        if (matchedProfile) {
            await addParticipant(eventId, matchedProfile.id, {
                IDNumber,
                firstName,
                lastName,
                middleName,
                email,
                phone,
                collegeDepartment,
                course,
                yearLevel,
                section,
                status: 'registered'
            });
            toast.success('Participant added successfully!');
            onClose();
        }else{
            const newProfileID = await createProfile({
                IDNumber,
                firstName,
                lastName,
                middleName,
                email,
                phone,
                collegeDepartment,
                course,
                yearLevel,
                section,
            })
            toast.success('Profile created successfully!');
            
            await addParticipant(eventId, newProfileID, {
                IDNumber,
                firstName,
                lastName,
                middleName,
                email,
                phone,
                collegeDepartment,
                course,
                yearLevel,
                section,
                status: 'registered'
            });
            toast.success('Participant added successfully!');
            onClose();
        }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to add participant.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="overlay w-full max-w-2xl rounded-lg border border-gray-700 bg-gray-900 text-color p-6"
          >
            {/* Header */}
                <div className="flex justify-between items-center py-4  border-gray-700">
                    <h2 className="text-xs font-semibold">Add Participant</h2>
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
                    <div className='p-1 bg-gray-700 rounded w-fit'><UserPlus2 size={20} className='text-gray-500'/></div>
                    <h2 className="text-xs font-semibold w-full text-left">Personal Information</h2>
                    {/* ID Number */}
                    <div className='flex justify-between w-full'>
                        <textarea
                        rows={1}
                        type="text"
                        placeholder="ID Number"
                        className="w-full overlay mb-0 rounded resize-none  text-color text-xs sm:text-lg placeholder-gray-500 border-none focus:outline-none"
                        value={IDNumber}
                        onChange={(e) => {
                          setIDNumber(e.target.value);
                        }}
                        />
                        <div className="flex justify-between">
                          {IDNumberError && (
                            <span className="text-red-500 text-xs">{IDNumberError}</span>
                          )}
                        </div>
                        {matchedProfile && (
                        <div className="flex justify-end mb-2">
                            <button
                            onClick={() => {
                                const {
                                IDNumber,
                                firstName,
                                lastName,
                                middleName,
                                email,
                                phone,
                                collegeDepartment,
                                course,
                                yearLevel,
                                section
                                } = matchedProfile;

                                setIDNumber(IDNumber || '');
                                setFirstName(firstName || '');
                                setLastName(lastName || '');
                                setMiddleName(middleName || '');
                                setEmail(email || '');
                                setPhone(phone || '');
                                setCollegeDepartment(collegeDepartment || '');
                                setCourse(course || '');
                                setYearLevel(yearLevel || '');
                                setSection(section || '');
                                toast.success("Profile information filled from existing record.");
                            }}
                            className="text-xs px-2 bg-green-600 hover:bg-green-700 rounded text-white whitespace-nowrap"
                            >
                            Match found — Autofill?
                            </button>
                        </div>
                        )}
                    </div>


                    {/* First Name */}
                    <div>
                        <textarea
                        rows={1}
                        type="text"
                        maxLength={FULLNAME_MAX + 1}
                        placeholder="First Name"
                        className="w-full overlay mb-0 rounded resize-none  text-color text-xs sm:text-lg placeholder-gray-500 border-none focus:outline-none"
                        value={firstName}
                        disabled={matchedProfile}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                        }}
                        />
                        <div className="flex justify-between">
                          {firstNameError && (
                            <span className="text-red-500 text-xs">{firstNameError}</span>
                          )}
                        </div>
                    </div>
                    
                    {/* Last Name */}
                    <div>
                        <textarea
                        rows={1}
                        type="text"
                        maxLength={FULLNAME_MAX + 1}
                        placeholder="Last Name"
                        className="w-full overlay mb-0 rounded resize-none  text-color text-xs sm:text-lg placeholder-gray-500 border-none focus:outline-none"
                        value={lastName}
                        disabled={matchedProfile}
                        onChange={(e) => {
                          setLastName(e.target.value);
                        }}
                        />
                        <div className="flex justify-between">
                          {lastNameError && (
                            <span className="text-red-500 text-xs">{lastNameError}</span>
                          )}
                        </div>
                    </div>

                    {/* Middle Name */}
                    <div>
                        <textarea
                        rows={1}
                        type="text"
                        maxLength={FULLNAME_MAX + 1}
                        placeholder="Middle Name"
                        className="w-full overlay mb-0 rounded resize-none  text-color text-xs sm:text-lg placeholder-gray-500 border-none focus:outline-none"
                        value={middleName}
                        disabled={matchedProfile}
                        onChange={(e) => {
                          setMiddleName(e.target.value);
                        }}
                        />
                        <div className="flex justify-between">
                          {middleNameError && (
                            <span className="text-red-500 text-xs">{middleNameError}</span>
                          )}
                        </div>
                    </div>

                    {/* Email & Phone*/}
                    <div className='flex gap-2 items-center justify-between'>
                        <textarea
                            rows={1}
                            type="email"
                            placeholder="Email"
                            className="w-full overlay mb-0 rounded resize-none  text-color text-xs sm:text-lg placeholder-gray-500 border-none focus:outline-none"
                            value={email}
                            disabled={matchedProfile}
                            onChange={(e) => {
                            setEmail(e.target.value);
                            }}
                        />
                        <div className="flex justify-between">
                            {emailError && (
                                <span className="text-red-500 text-xs">{emailError}</span>
                            )}
                        </div>

                        <textarea
                            rows={1}
                            type="text"
                            placeholder="Phone"
                            className="w-full overlay mb-0 rounded resize-none  text-color text-xs sm:text-lg placeholder-gray-500 border-none focus:outline-none"
                            value={phone}
                            disabled={matchedProfile}
                            onChange={(e) => {
                            setPhone(e.target.value);
                            }}
                        />
                        <div className="flex justify-between">
                            {phoneError && (
                                <span className="text-red-500 text-xs">{phoneError}</span>
                            )}
                        </div>
                    </div>

                    <h2 className="text-xs font-semibold w-full text-left">Academic Information</h2>

                    {/* College Department */}
                    <div className='flex gap-2 items-center justify-between'>
                        <textarea
                            rows={1}
                            placeholder="College Department"
                            className="w-full overlay mb-0 rounded resize-none text-color text-xs sm:text-lg placeholder-gray-500 border-none focus:outline-none"
                            value={collegeDepartment}
                            disabled={matchedProfile}
                            onChange={(e) => setCollegeDepartment(e.target.value)}
                        />
                        {collegeDepartmentError && (
                            <span className="text-red-500 text-xs">{collegeDepartmentError}</span>
                        )}

                        {/* Year Level */}
                        <div>
                            <textarea
                                rows={1}
                                placeholder="Year Level"
                                className="w-full overlay mb-0 rounded resize-none text-color text-xs sm:text-lg placeholder-gray-500 border-none focus:outline-none"
                                value={yearLevel}
                                disabled={matchedProfile}
                                onChange={(e) => setYearLevel(e.target.value)}
                            />
                            {yearLevelError && (
                                <span className="text-red-500 text-xs">{yearLevelError}</span>
                            )}
                        </div>
                    </div>

                    {/* Course */}
                    <div className='flex gap-2 items-center justify-between'>
                        <textarea
                            rows={1}
                            placeholder="Course"
                            className="w-full overlay mb-0 rounded resize-none text-color text-xs sm:text-lg placeholder-gray-500 border-none focus:outline-none"
                            value={course}
                            disabled={matchedProfile}
                            onChange={(e) => setCourse(e.target.value)}
                        />
                        {courseError && (
                            <span className="text-red-500 text-xs">{courseError}</span>
                        )}

                        {/* Section */}
                        <div>
                            <textarea
                                rows={1}
                                placeholder="Section"
                                className="w-full overlay mb-0 rounded resize-none text-color text-xs sm:text-lg placeholder-gray-500 border-none focus:outline-none"
                                value={section}
                                disabled={matchedProfile}
                                onChange={(e) => setSection(e.target.value)}
                            />
                            {sectionError && (
                                <span className="text-red-500 text-xs">{sectionError}</span>
                            )}
                        </div>
                    </div>
                    {/* Global Error */}
                    {error && (
                      <div className="text-red-500 text-xs text-center p-2 bg-red-500/10 rounded">
                        {error}
                      </div>
                    )}
                </div>
                {/* Footer */}
                <div className="py-4 flex gap-2 border-t border-gray-700 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-1.5 h-fit text-xs gap-2 font-medium text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 rounded"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        Cancel
                    </button>
                    <button
                      className="px-4 py-1.5 h-fit text-xs font-medium text-white accent-bg hover:bg-blue-500 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleAdd}
                      disabled={
                        isLoading
                      }
                    >
                      {isLoading ? 'Adding...' : 'Add Participant'}
                    </button>
                </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default AddParticipant;
