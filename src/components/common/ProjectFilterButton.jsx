import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
  Typography,
} from '@material-tailwind/react';
import {
  ChevronRightIcon,
  CircleAlert,
  CircleAlertIcon,
  CircleCheckIcon,
  CircleDashed,
  CircleSlashIcon,
  CircleXIcon,
  Ellipsis,
  EllipsisIcon,
  Hexagon,
  ListFilter,
  SignalHigh,
  SignalHighIcon,
  SignalLow,
  SignalLowIcon,
  SignalMedium,
  SignalMediumIcon,
} from 'lucide-react';
import { useState } from 'react';

export default function ProjectFilterButton() {
  const [openStatusMenu, setOpenStatusMenu] = useState(false);
  const [openPriorityMenu, setOpenPriorityMenu] = useState(false);

  return (
    <Menu placement="bottom-start">
      <MenuHandler>
        <Button
          variant="text"
          size="sm"
          className="flex items-center text-sm font-semibold justify-between px-4 py-1 hover:bg-gray-700 gap-2 text-color rounded-lg"
        >
          <ListFilter size={16} className="text-color-secondary" />
          <Typography className="overflow-hidden text-ellipsis whitespace-nowrap text-xs font-semibold text-color">
            Filter
          </Typography>
        </Button>
      </MenuHandler>

      <MenuList className="overlay text-color-secondary backdrop-blur-md w-full p-1 max-w-[230px] border-gray-700">
        <MenuItem className="text-color py-1.5 px-2 flex justify-between items-center hover:bg-gray-700">
          <Typography className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-color">
            Assigned to me
          </Typography>
        </MenuItem>

        <MenuItem className="py-1.5 px-2 flex justify-between items-center hover:bg-gray-700">
          <Typography className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-color">
            Shared with me
          </Typography>
        </MenuItem>

        <div className="h-px my-1 bg-gray-700" />

        {/* Status Submenu */}
        <Menu
          placement="right-start"
          open={openStatusMenu}
          handler={setOpenStatusMenu}
          allowHover
          offset={15}
        >
          <MenuHandler className="text-color text-sm py-1.5 px-2 flex items-center justify-between hover:bg-gray-700 w-full">
            <MenuItem>
              <Typography className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-color">
                Status
              </Typography>
              <span className="flex items-center gap-2">
                <ChevronRightIcon
                  strokeWidth={2.5}
                  className={`h-3.5 w-3.5 text-color-secondary transition-transform`}
                />
              </span>
            </MenuItem>
          </MenuHandler>
          <MenuList className="overlay text-color-secondary backdrop-blur-md w-full p-2 max-w-[200px] border-gray-700">
            <MenuItem className="text-color flex items-center gap-2 text-sm py-1.5 px-2 hover:bg-gray-700"><CircleDashed size={16} className="text-color-secondary" /> Backlog</MenuItem>
            <MenuItem className="text-color flex items-center gap-2 text-sm py-1.5 px-2 hover:bg-gray-700"><Hexagon size={16} className="text-color-secondary" /> Planned</MenuItem>
            <MenuItem className="text-color flex items-center gap-2 text-sm py-1.5 px-2 hover:bg-gray-700"><CircleSlashIcon size={16} className="text-color-secondary" /> In Progress</MenuItem>
            <MenuItem className="text-color flex items-center gap-2 text-sm py-1.5 px-2 hover:bg-gray-700"><CircleCheckIcon size={16} className="text-color-secondary" /> Completed</MenuItem>
            <MenuItem className="text-color flex items-center gap-2 text-sm py-1.5 px-2 hover:bg-gray-700"><CircleXIcon size={16} className="text-color-secondary" /> Cancelled</MenuItem>
          </MenuList>
        </Menu>

        {/* Priority Submenu */}
        <Menu
          placement="right-start"
          open={openPriorityMenu}
          handler={setOpenPriorityMenu}
          allowHover
          offset={15}
        >
          <MenuHandler className="text-color text-sm py-1.5 px-2 flex items-center justify-between hover:bg-gray-700 w-full">
            <MenuItem>
              <Typography className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-color">
                Priority
              </Typography>
              <span className="flex items-center gap-2">
                <ChevronRightIcon
                  strokeWidth={2.5}
                  className={`h-3.5 w-3.5 text-color-secondary transition-transform`}
                />
              </span>
            </MenuItem>
          </MenuHandler>
          <MenuList className="overlay text-color-secondary backdrop-blur-md w-full p-2 max-w-[150px] border-gray-700">
            <MenuItem className="text-color flex items-center gap-2 text-sm py-1.5 px-2 text-left hover:bg-gray-700"><EllipsisIcon size={16} className="text-color-secondary" /> No priority</MenuItem>
            <MenuItem className="text-color flex items-center gap-2 text-sm py-1.5 px-2 text-left hover:bg-gray-700"><CircleAlertIcon size={16} className="text-color-secondary" /> Urgent</MenuItem>
            <MenuItem className="text-color flex items-center gap-2 text-sm py-1.5 px-2 text-left hover:bg-gray-700"><SignalHighIcon size={16} className="text-color-secondary" /> High</MenuItem>
            <MenuItem className="text-color flex items-center gap-2 text-sm py-1.5 px-2 hover:bg-gray-700"><SignalMediumIcon size={16} className="text-color-secondary" /> Medium</MenuItem>
            <MenuItem className="text-color flex items-center gap-2 text-sm py-1.5 px-2 hover:bg-gray-700"><SignalLowIcon size={16} className="text-color-secondary" /> Low</MenuItem>
          </MenuList>
        </Menu>

        <div className="h-px my-1 bg-gray-700" />

        <MenuItem className="text-color text-sm py-1.5 px-2 flex justify-between items-center hover:bg-gray-700">
          <Typography className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-semibold text-color">
            Clear Filters
          </Typography>
          <span className="text-xs text-color-secondary ml-2">Esc</span>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
