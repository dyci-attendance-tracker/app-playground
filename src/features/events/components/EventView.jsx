import { useEffect, useState } from 'react';
import { useOutletContext, useParams } from 'react-router-dom';
import { useEvents } from '../../../contexts/EventContext';
import dayjs from 'dayjs';
import { Button, Typography } from '@material-tailwind/react';
import { BoxIcon } from 'lucide-react';
import Participants from '../../participants/Participants';

function EventView() {
  const { currentPage, itemsPerPage } = useOutletContext();
  const { eventID } = useParams();
  const { events, fetchEvents, isLoading } = useEvents();

  const [event, setEvent] = useState(null);


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

    </div>
  );
}

export default EventView;
