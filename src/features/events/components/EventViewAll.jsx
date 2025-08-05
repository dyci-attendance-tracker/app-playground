import { useEffect, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { useWorkspace } from '../../../contexts/WorkspaceContext';
import { useEvents } from '../../../contexts/EventContext';
import dayjs from 'dayjs';
import { BoxIcon, EllipsisVertical } from 'lucide-react';
import ActionsMenu from '../../../components/common/ActionsMenu';

function EventViewAll() {
  const { currentPage, itemsPerPage, filteredEvents } = useOutletContext();
  const { events, fetchEvents, isLoading } = useEvents();
  const containerRef = useRef(null);

  const navigate = useNavigate();

  const MIN_WIDTH = 350;
  const MAX_WIDTH = 550;

  const { currentWorkspace } = useWorkspace();

  useEffect(() => {
    fetchEvents();
  }, [currentWorkspace]);

  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div ref={containerRef} className="h-full flex relative rounded-lg transition-all duration-300">
      {/* Main Content */}
      <div className="flex-1 primary h-full overflow-y-auto">
        <div className="flex flex-col gap-4">
          <div className="w-full overflow-x-auto hide-scrollbar">
            <div className="min-w-[750px]">
              {/* Table Header */}
              <div className="grid grid-cols-[20px_1.5fr_2fr_150px_120px_140px] text-left gap-4 px-4 py-2 text-xs font-semibold text-color-secondary border-b border-gray-700">
                <span className="w-fit"></span>
                <span>Event Name</span>
                <span>Summary</span>
                <span>Date of Event</span>
                <span>Check-In Count</span>
                <span className="text-center pr-4">Options</span>
              </div>

              {/* Table Body */}
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-sm text-color-secondary mt-50">Loading events...</div>
                </div>
              ) : events.length === 0 ? (
                <div className="text-sm text-color-secondary p-4">No events found.</div>
              ) : (
                <div className="divide-y divide-gray-800">
                  {paginatedEvents.map((event) => (
                    <div
                      key={event.id}
                      className="grid grid-cols-[20px_1.5fr_2fr_150px_120px_140px] gap-4 px-4 py-3 text-left text-sm hover:bg-gray-800 transition-all cursor-pointer group"
                      onClick={() => {navigate(`/${currentWorkspace.url}/events/${event.id}`)}}
                    >
                      <div className="w-fit">
                        <BoxIcon size={18} className="text-gray-500" />
                      </div>
                      <div className="truncate text-color">{event.name}</div>
                      <div className="truncate text-color-secondary">{event.summary}</div>
                      <div className="text-color-secondary">
                        {dayjs(event.date).format('MMM D, YYYY')}
                      </div>
                      <div className="text-color-secondary">{event.checkInCount || '0/0'}</div>
                      <div className="flex items-center gap-2 justify-center pr-7">
                        <ActionsMenu
                          selectedEvent={event}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>


      
    </div>
  );
}

export default EventViewAll;
