import { useEffect, useState } from 'react'
import { Box, PanelRight, Plus, Search, Upload, UserPlus2 } from 'lucide-react'
import { useSidebar } from '../../contexts/SidebarContext'
import MainView from './components/EventView'
import { Outlet, useParams } from 'react-router'
import { Button, Chip, Typography } from '@material-tailwind/react'
import { useWorkspace } from '../../contexts/WorkspaceContext'
import { navigatePage } from '../../utils/navigation'
import CopyLinkButton from '../../components/common/CopyLinkButton'
import ProjectFilterButton from '../../components/common/ProjectFilterButton'
import CreateEvent from './CreateEvent'
import ActionsMenu from '../../components/common/ActionsMenu'
import { useEvents } from '../../contexts/EventContext'
import { useParticipants } from '../../contexts/ParticipantsContext'
import AddParticipant from '../participants/AddParticipant'
import ImportParticipants from '../participants/ImportParticipants'

function Events() {
  const { eventID } = useParams();
  const { currentWorkspace } = useWorkspace();
  const { events } = useEvents();

  const [openModal, setOpenModal] = useState(false);
  const [openAddParticipantModal, setOpenAddParticipantModal] = useState(false);
  const [openImportModal, setOpenImportModal] = useState(false);
  const { setIsLeftSidebarOpen, setIsMobileOpen } = useSidebar();
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const { participants } = useParticipants();

  // 🔍 Filter logic
  const filteredEvents = (events ?? []).filter((event) =>
    event.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = eventID
    ? Math.ceil(participants.length / itemsPerPage)
    : Math.ceil(filteredEvents.length / itemsPerPage);

  useEffect(() => {
    if (location.pathname.includes(`/events/all`)) {
      setSelectedEvent("");
    }
  }, [location.pathname]);

  useEffect(() => {
    const found = events.find(e => e.id === eventID);
    if (found) {
      setSelectedEvent(found);
    }
  }, [events, eventID]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <>
      <CreateEvent open={openModal} onClose={() => setOpenModal(false)} />
      <AddParticipant open={openAddParticipantModal} onClose={() => setOpenAddParticipantModal(false)} eventId={eventID}/>
      <ImportParticipants open={openImportModal} onClose={() => setOpenImportModal(false)} eventId={eventID} />
      <main className="flex-1 h-full lg:border lg:border-gray-700 lg:rounded-lg primary">
        <div className='h-full flex flex-col'>
          
          {/* Top Bar */}
          <div className="h-10 border-b border-gray-700 px-4 flex items-center justify-between sm:justify-end">
            <div className='flex items-center justify-between w-full'>
              <div className='flex items-center gap-3'>
                <button className="lg:hidden text-color-secondary hover:text-color" onClick={() => setIsMobileOpen(true)}>
                  <PanelRight size={16} />
                </button>
                <button className="hidden lg:block text-color-secondary hover:text-color" onClick={() => setIsLeftSidebarOpen(prev => !prev)}>
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
                  className="bg-gray-700 text-color px-2 py-1 hidden sm:block rounded-md cursor-pointer hover:bg-gray-600"
                  onClick={() => navigatePage(`/${currentWorkspace.url}/events/all`)}
                />
              </div>
              <div className='flex items-center gap-2'>
                <CopyLinkButton />

                {selectedEvent && (<Button className='flex bg-gray-700 gap-1 items-center px-2 py-1 text-color text-xs font-semibold hover:bg-gray-600' onClick={() => setOpenImportModal(true)}>
                    <Upload size={16} className='text-color-secondary' />
                    <Typography className='sm:block hidden text-xs'>Import Participants</Typography>
                </Button>)}
                
                {selectedEvent && (<Button className='flex bg-gray-700 gap-1 items-center px-2 py-1 text-color text-xs font-semibold hover:bg-gray-600' onClick={() => setOpenAddParticipantModal(true)}>
                  <UserPlus2 size={16} className='text-color-secondary' />
                  <Typography className='sm:block hidden text-xs'>Add Participant</Typography>
                </Button>)}

                <Button className='flex bg-gray-700 gap-1 items-center px-2 py-1 text-color text-xs font-semibold hover:bg-gray-600' onClick={() => setOpenModal(true)}>
                  <Plus size={16} className='text-color-secondary' />
                  <Typography className='sm:block hidden text-xs'>Add Event</Typography>
                </Button>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="h-10 border-b border-gray-700 px-3 flex items-center justify-between sm:justify-end">
            <div className="flex gap-2 items-center justify-between w-full">

                {!selectedEvent && (
                    <div className="relative w-full max-w-xs">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search size={16} className="text-gray-500" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchQuery}
                        onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                        }}
                        className="pl-10 w-full px-3 py-1.5 rounded-md secondary border border-gray-700 text-xs text-color placeholder:text-gray-500 focus:outline-none"
                    />
                    </div>
                )}

                {selectedEvent && (<div className="relative w-full max-w-xs">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <Search size={16} className="text-gray-500" />
                    </div>
                    <input
                    type="text"
                    placeholder="Search profiles..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="pl-10 w-full px-3 py-1.5 rounded-md secondary border border-gray-700 text-xs text-color placeholder:text-gray-500 focus:outline-none"
                    />
                </div>)}

                <div className="flex gap-2">
                    <ProjectFilterButton />
                    {selectedEvent && (
                        <div className="flex gap-2 ml-auto">
                        <ActionsMenu selectedEvent={selectedEvent} />
                        </div>
                    )}
                </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 rounded-lg overflow-x-auto hide-scrollbar">
            <Outlet context={{
              currentPage,
              itemsPerPage,
              filteredEvents,
            }} />
          </div>

          {/* Pagination */}
          <div className="flex w-full mt-auto justify-between items-center gap-2 py-4 lg:px-6 px-4 text-sm text-color-secondary border-t border-gray-700">
            <Typography className='text-color text-xs font-semibold'>Page {currentPage} of {totalPages}</Typography>
            <div className="flex gap-4 items-center">
              <div className="flex gap-1 items-center">
                <span className="text-xs text-color-secondary">Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(parseInt(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="custom-select w-fit px-2 py-1 text-center text-color border border-gray-700 rounded-md bg-gray-900 focus:outline-none"
                >
                  {eventID && <option value={5}>5</option>}
                  <option value={10}>10</option>
                  <option value={15}>15</option>
                  <option value={20}>20</option>
                </select>
                <span className="text-xs text-color-secondary">entries</span>
              </div>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-gray-700 text-color px-3 py-2 text-xs font-semibold rounded-md hover:bg-gray-600 disabled:opacity-50"
              >
                Prev
              </button>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || currentPage > totalPages}
                className="bg-gray-700 text-color px-3 py-2 text-xs font-semibold rounded-md hover:bg-gray-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

        </div>
      </main>
    </>
  )
}

export default Events;
