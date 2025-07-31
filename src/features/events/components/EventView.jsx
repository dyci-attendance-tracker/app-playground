import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useEvents } from '../../../contexts/EventContext';
import dayjs from 'dayjs';
import { Button, Typography } from '@material-tailwind/react';
import { BoxIcon } from 'lucide-react';
import Participants from '../../participants/Participants';
import { useParticipants } from '../../../contexts/ParticipantsContext';

function EventView() {
  const { eventID } = useParams();
  const { events, fetchEvents, isLoading } = useEvents();

  const [event, setEvent] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { participants } = useParticipants();

  // Get event when events change or eventId changes
  useEffect(() => {
    const found = events.find(e => e.id === eventID);
    if (found) {
      setEvent(found);
    }
  }, [events, eventID]);

  useEffect(() => {
    fetchEvents();
  }, []);

  if (isLoading || !event) {
    return (
      <div className="flex-1 primary flex items-center justify-center text-color-secondary text-sm">
        Loading event...
      </div>
    );
  }

  const totalPages = Math.ceil(participants.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading || !event) {
    return <div className="flex-1 primary flex items-center justify-center text-color-secondary text-sm">Loading event...</div>;
  }

  return (
    <div className="h-full flex flex-col justify-between relative rounded-lg transition-all duration-300">
      <div className="flex-1 primary lg:p-4 p-3 flex flex-col gap-4">
        <div className='flex items-center gap-3'>
          <BoxIcon size={24} className="text-gray-500" />
          <div className="flex-1 text-left w-full pr-3">
            <Typography className="text-lg font-semibold text-color break-words whitespace-pre-wrap">{event.name}</Typography>
            <Typography className="text-xs text-color-secondary">Date: {dayjs(event.date).format('MM DD, YYYY')}</Typography>
          </div>
        </div>
        <div className="flex flex-col gap-4 items-center lg:pl-2 pl-3">
          <span className="flex flex-col gap-0 items-center justify-start w-full">
            <Typography className='text-xs text-color-secondary text-left w-full'>Summary</Typography>
            <Typography className="text-sm text-color text-left w-full break-words whitespace-pre-wrap">{event.summary}</Typography>
          </span>
          <span className="flex flex-col gap-0 items-center justify-start w-full">
            <Typography className='text-xs text-color-secondary text-left w-full'>Description</Typography>
            <Typography className="text-sm text-color text-left w-full break-words whitespace-pre-wrap">{event.description}</Typography>
          </span>
        </div>
      </div>
      <div className="min-w-[300px] min-h-[50vh] overflow-x-auto p-4 flex flex-col gap-4 hide-scrollbar">
        <Participants currentPage={currentPage} itemsPerPage={itemsPerPage}/>
      </div>
      {/* Pagination Below */}
      <div className="flex w-full mt-auto justify-between items-center gap-2 py-4 lg:px-6 px-4 text-sm text-color-secondary border-t border-gray-700">
        <Typography className='text-color text-xs font-semibold'>Page {currentPage} of {totalPages}</Typography>
        <div className="flex gap-4 items-center">
          <div className="flex gap-1 items-center">
            <span className="text-xs text-color-secondary">Show</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {setItemsPerPage(parseInt(e.target.value)); setCurrentPage(1);}}
              className="custom-select w-fit px-2 py-1 text-center text-color border border-gray-700 rounded-md bg-gray-900 focus:outline-none"
            >
              <option value={5}>5</option>
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
            disabled={currentPage === totalPages}
            className="bg-gray-700 text-color px-3 py-2 text-xs font-semibold rounded-md hover:bg-gray-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default EventView;
