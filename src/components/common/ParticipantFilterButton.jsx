import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Button,
  Typography,
} from '@material-tailwind/react';
import { ChevronRightIcon, CircleCheckIcon, CircleDashed, CircleXIcon, ListFilter } from 'lucide-react';
import { useState } from 'react';

const DEPARTMENTS = {
  "College of Computer Studies": ["BS Computer Science", "BS Information Technology", "BS Computer Engineering"],
  "College of Accountancy": ["BS Accountancy", "BS Management Accounting"],
  "College of Business Administration": ["BSBA Major in Marketing", "BSBA Major in Financial Management"],
  "College of Health Sciences": ["BS Nursing", "BS Midwifery"],
  "College of Hospitality Management and Tourism": ["BS Hotel and Restaurant Management", "BS Tourism"],
  "College of Maritime Engineering": ["BS Marine Engineering", "BS Marine Transportation"],
  "College of Education": ["BEEd", "BSEd Major in Math", "BSEd Major in English"],
  "College of Arts and Sciences": ["AB Communication", "BS Biology"],
  "School of Psychology": ["BS Psychology"],
  "School of Mechanical Engineering": ["BS Mechanical Engineering"],
};

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const SECTIONS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const STATUS_OPTIONS = ["registered", "attended", "no-show"];

export default function ParticipantFilterButton({
  selectedDepartment,
  setSelectedDepartment,
  selectedCourse,
  setSelectedCourse,
  selectedYear,
  setSelectedYear,
  selectedSection,
  setSelectedSection,
  selectedStatus,
  setSelectedStatus,
  }) {

  // Your status constants
  const STATUS_OPTIONS = ['attended', 'registered', 'no-show'];

  // Icon map (add more if you need)
  const STATUS_ICONS = {
    attended: <CircleDashed size={16} className="text-color-secondary" />,
    registered: <CircleCheckIcon size={16} className="text-green-400" />,
    'no-show': <CircleXIcon size={16} className="text-red-400" />,
  };

  const [openDepartmentMenu, setOpenDepartmentMenu] = useState(false);
  const [openCourseMenu, setOpenCourseMenu] = useState(false);
  const [openYearMenu, setOpenYearMenu] = useState(false);
  const [openSectionMenu, setOpenSectionMenu] = useState(false);
  const [openStatusMenu, setOpenStatusMenu] = useState(false);

  const courses = selectedDepartment ? DEPARTMENTS[selectedDepartment] : [];

  return (
    <Menu placement="bottom-start">
      <MenuHandler>
        <Button
          variant="text"
          size="sm"
          className="flex items-center text-sm font-semibold justify-between px-4 py-1 hover:bg-gray-700 gap-2 text-color rounded-lg"
        >
          <ListFilter size={16} className="text-color-secondary" />
          <Typography className="text-sm lg:text-xs font-semibold text-color">Filter</Typography>
        </Button>
      </MenuHandler>

      <MenuList className="overlay text-color-secondary backdrop-blur-md w-full p-1 max-w-[230px] border-gray-700">
        {/* Department */}
        <Menu
          placement={window.innerWidth < 1024 ? 'bottom-start' : 'right-start'}
          open={openDepartmentMenu}
          handler={setOpenDepartmentMenu}
          allowHover
          offset={15}
        >
          <MenuHandler className="text-color text-sm py-1.5 px-2 flex items-center justify-between hover:bg-gray-700 w-full">
            <MenuItem>
              <Typography className="text-sm font-semibold text-color">Department</Typography>
              <ChevronRightIcon size={14} className="text-color-secondary" />
            </MenuItem>
          </MenuHandler>
          <MenuList className="overlay text-color-secondary backdrop-blur-md p-2 max-w-[300px] border-gray-700">
            {Object.keys(DEPARTMENTS).map((dept) => (
              <MenuItem
                key={dept}
                onClick={() => setSelectedDepartment(dept)}
                className="text-color text-sm py-1.5 px-2 hover:bg-gray-700"
              >
                {dept}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        {/* Course (depends on department) */}
        {selectedDepartment && (
          <Menu
            placement={window.innerWidth < 1024 ? 'bottom-start' : 'right-start'}
            open={openCourseMenu}
            handler={setOpenCourseMenu}
            allowHover
            offset={15}
          >
            <MenuHandler className="text-color text-sm py-1.5 px-2 flex items-center justify-between hover:bg-gray-700 w-full">
              <MenuItem>
                <Typography className="text-sm font-semibold text-color">Course</Typography>
                <ChevronRightIcon size={14} className="text-color-secondary" />
              </MenuItem>
            </MenuHandler>
            <MenuList className="overlay text-color-secondary backdrop-blur-md p-2 max-w-[300px] border-gray-700">
              {courses.map((course) => (
                <MenuItem
                  key={course}
                  className="text-color text-sm py-1.5 px-2 hover:bg-gray-700"
                  onClick={() => setSelectedCourse(course)}
                >
                  {course}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        )}

        {/* Year */}
        <Menu
          placement="right-start"
          open={openYearMenu}
          handler={setOpenYearMenu}
          allowHover
          offset={15}
        >
          <MenuHandler className="text-color text-sm py-1.5 px-2 flex items-center justify-between hover:bg-gray-700 w-full">
            <MenuItem>
              <Typography className="text-sm font-semibold text-color">Year Level</Typography>
              <ChevronRightIcon size={14} className="text-color-secondary" />
            </MenuItem>
          </MenuHandler>
          <MenuList className="overlay text-color-secondary backdrop-blur-md p-2 max-w-[200px] border-gray-700">
            {YEARS.map((year) => (
              <MenuItem key={year}
                onClick={() => setSelectedYear(year)}
                className="text-color text-sm py-1.5 px-2 hover:bg-gray-700">
                {year}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        {/* Section */}
        <Menu
          placement="right-start"
          open={openSectionMenu}
          handler={setOpenSectionMenu}
          allowHover
          offset={15}
        >
          <MenuHandler className="text-color text-sm py-1.5 px-2 flex items-center justify-between hover:bg-gray-700 w-full">
            <MenuItem>
              <Typography className="text-sm font-semibold text-color">Section</Typography>
              <ChevronRightIcon size={14} className="text-color-secondary" />
            </MenuItem>
          </MenuHandler>
          <MenuList className="overlay text-color-secondary backdrop-blur-md p-2 max-w-[200px] border-gray-700">
            {SECTIONS.map((section) => (
              <MenuItem key={section}
                onClick={() => setSelectedSection(section)}
                className="text-color text-sm py-1.5 px-2 hover:bg-gray-700">
                {section}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        {/* Status */}
        <Menu
          placement={window.innerWidth < 1024 ? 'bottom-end' : 'right-start'}
          open={openStatusMenu}
          handler={setOpenStatusMenu}
          allowHover
          offset={15}
        >
          <MenuHandler className="text-color text-sm py-1.5 px-2 flex items-center justify-between hover:bg-gray-700 w-full">
            <MenuItem>
              <Typography className="text-sm font-semibold text-color">Status</Typography>
              <ChevronRightIcon size={14} className="text-color-secondary" />
            </MenuItem>
          </MenuHandler>
          <MenuList className="overlay text-color-secondary backdrop-blur-md p-2 max-w-[200px] border-gray-700">
            {STATUS_OPTIONS.map((status) => (
              <MenuItem
                key={status}
                onClick={(e) => {
                  
                  setSelectedStatus(status);
                }}
                className="text-color flex items-center gap-2 text-sm py-1.5 px-2 hover:bg-gray-700"
              >
                {STATUS_ICONS[status]}
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        <div className="h-px my-1 bg-gray-700" />

        <MenuItem
          className="text-color text-sm py-1.5 px-2 flex justify-between items-center hover:bg-gray-700"
          onClick={() => {
            setSelectedDepartment(null);
            setSelectedCourse(null);
            setSelectedYear(null);
            setSelectedSection(null);
            setSelectedStatus(null);
            // Clear other states if added
          }}
        >
          <Typography className="text-sm font-semibold text-color">
            Clear Filters
          </Typography>
          <span className="text-sm text-color-secondary ml-2">Esc</span>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
