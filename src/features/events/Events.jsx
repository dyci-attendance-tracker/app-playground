import { useEffect, useState } from 'react'
import { Box, Link, ListFilter, PanelRight, Plus, SlidersHorizontal } from 'lucide-react'
import { useSidebar } from '../../contexts/SidebarContext'
import MainView from './components/EventView'
import { Outlet, useParams } from 'react-router'
import { Button, Chip, Menu, MenuHandler, MenuItem, MenuList, Typography } from '@material-tailwind/react'
import { useWorkspace } from '../../contexts/WorkspaceContext'
import { navigatePage } from '../../utils/navigation'
import CopyLinkButton from '../../components/common/CopyLinkButton'
import ProjectFilterButton from '../../components/common/ProjectFilterButton'
import CreateEvent from './CreateEvent'

import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import ActionsMenu from '../../components/common/ActionsMenu'
import { useEvents } from '../../contexts/EventContext'

function Events() {
    const { eventID } = useParams();
    const { currentWorkspace } = useWorkspace();
    const { events } = useEvents();

    const [openModal, setOpenModal] = useState(false);

    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
    const { setIsLeftSidebarOpen, setIsMobileOpen } = useSidebar();

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (location.pathname.includes(`/events/all`)) {
            setSelectedEvent("");
            setIsEditing(false);
        }
    }, [location.pathname]);

    // Get event when events change or eventId changes
    useEffect(() => {
        const found = events.find(e => e.id === eventID);
        if (found) {
        setSelectedEvent(found);
        }
    }, [events, eventID]);



    return (
        <>
        <CreateEvent open={openModal} onClose={() => setOpenModal(false)} />
        <main className="flex-1 h-full lg:border lg:border-gray-700 lg:rounded-lg primary ">
            <div className='h-full flex flex-col'>
                <div className="h-10 border-b border-gray-700 px-4 flex items-center justify-between sm:justify-end">
                    {/* Sidebar */}
                    <div className="flex gap-2 justify-between items-center w-full ">
                        <div className='flex items-center justify-between w-full'>
                            <div className='flex items-center gap-3'>
                                <button className="lg:hidden text-color-secondary hover:text-color cursor-pointer transition-colors duration-200" onClick={() => setIsMobileOpen(true)}>
                                    <PanelRight size={16} />
                                </button>
                                <button
                                className="hidden lg:block text-color-secondary hover:text-color cursor-pointer transition-colors duration-200"
                                    onClick={() => setIsLeftSidebarOpen(prev => !prev)}
                                >
                                    <PanelRight size={16} />
                                </button>
                                <Typography className='text-color text-xs font-semibold'>Events</Typography>
                                <Chip
                                    variant="ghost"
                                    value={
                                        <span className="flex items-center gap-1">
                                        <Box size={16} className="text-color-secondary" />
                                        <Typography className='text-color text-xs font-semibold'>All Events</Typography>
                                        </span>
                                    }
                                    className="bg-gray-700 text-color px-2 py-1 hidden sm:block rounded-md cursor-pointer hover:bg-gray-600 transition-colors duration-200"
                                    onClick={() => navigatePage(`/${currentWorkspace.url}/events/all`)}
                                />
                                <div className="h-4 border-l border-gray-700 mx-2 hidden sm:block"></div>
                            </div>

                            <div className='flex items-center gap-2'>
                                <CopyLinkButton></CopyLinkButton>
                                <Button className='flex bg-gray-700 cursor-pointer gap-1 items-center px-2 py-1 text-color text-xs font-semibold hover:bg-gray-600' onClick={() => setOpenModal(true)}><Plus size={16} className='text-color-secondary'></Plus> <Typography className='sm:block hidden text-xs'>Add Event</Typography></Button>

                                <div className="h-4 border-l border-gray-700 mx-2"></div>
                                <button
                                    className="text-color-secondary hover:text-color cursor-pointer transition-colors duration-200"
                                    onClick={() => setIsRightSidebarOpen(prev => !prev)}
                                >
                                    <PanelRight size={16} className='rotate-180' />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-10 border-b border-gray-700 px-3 flex items-center justify-between sm:justify-end sm:hidden">
                </div>

                {/* Filters */}
                <div className="h-10 border-b border-gray-700 px-3 flex items-center justify-between sm:justify-end">
                    <div className="flex gap-2 justify-between items-center w-full ">
                        <ProjectFilterButton></ProjectFilterButton>
                        {selectedEvent && (
                            <div className="flex gap-2 ml-auto">
                                <ActionsMenu
                                    selectedEvent={selectedEvent}
                                />
                            </div>
                        )}
                    </div>
                </div>


                {/* Sidebar */}
                <div className="flex-1 rounded-lg overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700">
                    <div className="min-w-full">
                    {/* Outlet passes sidebar control as context */}
                    <Outlet context={{
                        isRightSidebarOpen,
                        selectedEvent,
                        setSelectedEvent,
                        isEditing,
                        setIsEditing,
                    }}></Outlet>
                    </div>
                </div>
            </div>
        </main>
        </>
    )
}

export default Events
