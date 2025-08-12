import React, { useEffect, useState } from 'react';
import { CaretLeft } from 'phosphor-react';
import { useParticipants } from '../../contexts/ParticipantsContext';
import { useProfiles } from '../../contexts/ProfilesContext';
import useDebounce from '../../hooks/useDebounce';
import { toast } from 'sonner';
import { useParams } from 'react-router';
import { useEvents } from '../../contexts/EventContext';
import { Typography } from '@material-tailwind/react';
import { ChevronDown } from 'lucide-react';
import dayjs from 'dayjs';

const DEPARTMENTS = JSON.parse(import.meta.env.VITE_DEPARTMENTS_JSON || '{}');
const YEARS = (import.meta.env.VITE_YEARS || '').split(',').map(s => s.trim());
const SECTIONS = (import.meta.env.VITE_SECTIONS || '').split(',').map(s => s.trim());

function AddParticipantPage() {
    const { workspaceID, eventID } = useParams();

    const { fetchEventById } = useEvents();
    const { addParticipant, findProfileByIDNumber, fetchParticipants } = useParticipants();
    const { createProfile } = useProfiles();

    const [event, setEvent] = useState();

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

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const debouncedID = useDebounce(IDNumber, 500);
    const [matchedProfile, setMatchedProfile] = useState(null);

    useEffect(() => {
        const loadEvent = async () => {
            const eventData = await fetchEventById(eventID, workspaceID);
            setEvent(eventData);
        };

        loadEvent();
    }, [eventID]);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!debouncedID.trim()) {
                setMatchedProfile(null);
                return;
            }
            const profile = await findProfileByIDNumber(workspaceID, debouncedID);
            setMatchedProfile(profile || null);
            console.log(profile)
        };
        fetchProfile();
    }, [debouncedID]);

    // Would prefill it if it matches but this is a breach of security and privacy as student information can be seen by just typing student id number
    // useEffect(() => {
    //     if (matchedProfile) {
    //         setFirstName(matchedProfile.firstName || '');
    //         setLastName(matchedProfile.lastName || '');
    //         setMiddleName(matchedProfile.middleName || '');
    //         setEmail(matchedProfile.email || '');
    //         setPhone(matchedProfile.phone || '');
    //         setCollegeDepartment(matchedProfile.collegeDepartment || '');
    //         setCourse(matchedProfile.course || '');
    //         setYearLevel(matchedProfile.yearLevel || '');
    //         setSection(matchedProfile.section || '');
    //     }
    // }, [matchedProfile]);

    const validateFields = () => {
    let isValid = true;

    if (firstName.length > FULLNAME_MAX) {
      setError(`Max ${FULLNAME_MAX} characters`);
      isValid = false;
    } else {
      setError('');
    }

    if (lastName.length > FULLNAME_MAX) {
      setError(`Max ${FULLNAME_MAX} characters`);
      isValid = false;
    } else {
      setError('');
    }

    if (!email.trim()) {
      setError('Email is required');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Invalid email format');
      isValid = false;
    } else {
      setError('');
    }

    if (!phone.trim()) {
      setError('Phone number is required');
      isValid = false;
    } else if (!/^\d{11}$/.test(phone)) {
      setError('Invalid phone number format');
      isValid = false;
    } else {
      setError('');
    }

    if (!collegeDepartment.trim()) {
        setError('Department is required');
        isValid = false;
    } else {
        setError('');
    }

    if (!course.trim()) {
        setError('Course is required');
        isValid = false;
    } else {
        setError('');
    }

    if (!yearLevel.trim()) {
        setError('Year level is required');
        isValid = false;
    } else {
        setError('');
    }

    if (!section.trim()) {
        setError('Section is required');
        isValid = false;
    } else {
        setError('');
    }


    if (error) {
      isValid = false;
    }

    return isValid;
    };



    const handleCreateParticipant = async () => {
        if (!IDNumber || !firstName || !lastName || !email || !collegeDepartment || !course || !yearLevel || !section) {
            setError('Please fill in all required fields.');
            return;
        }

        if (error) return;

        setIsLoading(true);
        try {
            if (matchedProfile) {

                if (matchedProfile.IDNumber !== IDNumber){
                    await addParticipant(workspaceID ,eventID, matchedProfile.id, {
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
                }else{
                    toast.info('Participant already registered');
                }
            }else{
                const newProfileID = await createProfile(workspaceID,{
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
                
                await addParticipant(workspaceID, eventID, newProfileID, {
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
                fetchParticipants(workspaceID);
            }
        } catch (err) {
            console.error(err);
            toast.error(err.message || "Failed to add participant.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='flex flex-col h-[100vh] overflow-y-auto primary px-4 sm:px-10 py-2'>
            <div className='flex flex-col sm:flex-row justify-end items-start sm:items-center px-4 sm:px-10 py-3 w-full h-auto mb-4 gap-4 sm:gap-0'>
                <div className='absolute top-5 right-5 lg:top-10 lg:right-10 flex flex-col items-end sm:items-start gap-1 ml-auto'>
                    <p className='text-color-secondary text-sm font-semibold'>Logged in as <span className='text-color text-sm font-semibold break-all'>Guest</span></p>
                </div>
            </div>
            {/* Body */}
            <div className='flex justify-center items-center px-4 sm:px-10 w-full h-full'>
                <div className='flex flex-col items-center gap-5 w-full max-w-2xl h-full'>
                    <div className='flex flex-col justify-center items-center gap-4 text-center'>
                        <div>
                            <p className='text-color text-2xl font-semibold'>{event?.name || ""}</p>
                            <Typography className="text-sm text-color-secondary">When: {dayjs(event?.date).format('MM DD, YYYY')}</Typography>
                        </div>
                        <p className='text-color-secondary text-sm font-semibold'>
                            {event?.description || ""}
                        </p>
                    </div>

                    <div className='secondary flex flex-col justify-center items-center w-full rounded-lg max-h-[58vh]'>
                        <div className='overflow-y-auto hide-scrollbar w-full h-full px-4 sm:px-10 py-6'>
                            <form className="flex flex-col gap-6 p-4 sm:p-6" onSubmit={(e) => e.preventDefault()}>
                                {/* ID Number */}
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm text-left font-medium text-gray-700">ID Number *</label>
                                    <input
                                    type="text"
                                    placeholder="e.g., 2023-00001"
                                    className="w-full rounded border border-gray-700 px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={IDNumber}
                                    onChange={(e) => setIDNumber(e.target.value)}
                                    />
                                </div>

                                {/* Name */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="flex flex-col gap-1">
                                    <label className="text-sm text-left font-medium text-gray-700">First Name * </label>
                                    <input
                                        type="text"
                                        className="rounded border border-gray-700 px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                    />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                    <label className="text-sm text-left font-medium text-gray-700">Last Name *</label>
                                    <input
                                        type="text"
                                        className="rounded border border-gray-700 px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                    />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                    <label className="text-sm text-left font-medium text-gray-700">Middle Name</label>
                                    <input
                                        type="text"
                                        className="rounded border border-gray-700 px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={middleName}
                                        onChange={(e) => setMiddleName(e.target.value)}
                                    />
                                    </div>
                                </div>

                                {/* Contact Info */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1">
                                    <label className="text-sm text-left font-medium text-gray-700">Email *</label>
                                    <input
                                        type="email"
                                        className="rounded border border-gray-700 px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                    <label className="text-sm text-left font-medium text-gray-700">Phone</label>
                                    <input
                                        type="text"
                                        className="rounded border border-gray-700 px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                    </div>
                                </div>

                                <div className='bg-gray-700 h-0.5'/>

                                {/* Academic Info */}
                                <div className="flex flex-col gap-2">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* College Department */}
                                    <div className="flex flex-col gap-1">
                                        <label className="text-sm text-left font-medium text-gray-700">College Department *</label>
                                        <div className="relative w-full">
                                            <select
                                                value={collegeDepartment}
                                                onChange={(e) => {
                                                setCollegeDepartment(e.target.value);
                                                setCourse(""); // reset course when department changes
                                                }}
                                                className="appearance-none w-full rounded border border-gray-700 px-3 py-2 pr-10 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400"
                                            >
                                                <option value="" disabled>Select Department</option>
                                                {Object.keys(DEPARTMENTS).map((dept) => (
                                                <option className='text-black' key={dept} value={dept}>{dept}</option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-hover:text-blue-500">
                                                <ChevronDown className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Course */}
                                    <div className="flex flex-col gap-1">
                                    <label className="text-sm text-left font-medium text-gray-700">Course *</label>
                                    <div className="relative w-full">
                                        <select
                                            value={course}
                                            onChange={(e) => setCourse(e.target.value)}
                                            disabled={!collegeDepartment}
                                            className="appearance-none w-full rounded border border-gray-700 px-3 py-2 pr-10 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400"
                                        >
                                            <option value="" disabled>{collegeDepartment ? "Select Course" : "Select Department first"}</option>
                                            {(DEPARTMENTS[collegeDepartment] || []).map((courseOption) => (
                                            <option className='text-black' key={courseOption} value={courseOption}>{courseOption}</option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-hover:text-blue-500">
                                            <ChevronDown className="w-4 h-4" />
                                        </div>
                                    </div>
                                    </div>

                                    {/* Year Level */}
                                    <div className="flex flex-col gap-1">
                                    <label className="text-sm text-left font-medium text-gray-700">Year Level *</label>
                                    <div className="relative w-full">
                                        <select
                                            value={yearLevel}
                                            onChange={(e) => setYearLevel(e.target.value)}
                                            className="appearance-none w-full rounded border border-gray-700 px-3 py-2 pr-10 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400"
                                        >
                                            <option value="" disabled>Select Year</option>
                                            {YEARS.map((year) => (
                                            <option className='text-black' key={year} value={year}>{year}</option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-hover:text-blue-500">
                                            <ChevronDown className="w-4 h-4" />
                                        </div>
                                    </div>
                                    </div>

                                    {/* Section */}
                                    <div className="flex flex-col gap-1">
                                    <label className="text-sm text-left font-medium text-gray-700">Section *</label>
                                    <div className="relative w-full">
                                        <select
                                            value={section}
                                            onChange={(e) => setSection(e.target.value)}
                                            className="appearance-none w-full rounded border border-gray-700 px-3 py-2 pr-10 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400"
                                        >
                                            <option value="" disabled>Select Section</option>
                                            {SECTIONS.map((sec) => (
                                            <option className='text-black' key={sec} value={sec}>{sec}</option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 group-hover:text-blue-500">
                                            <ChevronDown className="w-4 h-4" />
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                </div>

                                {/* Error */}
                                {error && (
                                    <p className="text-red-500 text-sm">{error}</p>
                                )}
                                </form>

                        </div>
                    </div>

                    <button
                        onClick={handleCreateParticipant}
                        disabled={isLoading}
                        className='accent-bg text-white cursor-pointer w-full max-w-xs flex items-center justify-center gap-3 py-2.5 px-4 rounded-md font-medium hover:bg-opacity-90 transition-colors mt-4 disabled:opacity-60'
                    >
                        <span className='text-sm'>
                            {isLoading ? 'Creating...' : 'Add Participant'}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddParticipantPage;