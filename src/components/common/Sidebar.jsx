import { useState, useEffect } from "react"
import { CaretLeft } from "phosphor-react"
import { ResizableBox } from "react-resizable"
import { Accordion, AccordionBody, AccordionHeader, Button, IconButton, Menu, MenuHandler, MenuItem, MenuList, Typography } from "@material-tailwind/react"
import { useWorkspace } from "../../contexts/WorkspaceContext";
import { Box, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, ChevronUpIcon, Copy, Ellipsis, Focus, Inbox, Layers2, Search, SquarePen, SquareUserRound, UserRoundPen, UsersRound } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useSidebar } from "../../contexts/SidebarContext";
import { navigatePage, changeWorkspace } from "../../utils/navigation";
import { useParams } from "react-router";

function Sidebar() {
    const { currentUser, logout } = useAuth();
    const { isLoading, workspaces, currentWorkspace } = useWorkspace();

    const {workspaceID} = useParams();

    const { openMenu, setOpenMenu } = useState();

    const {isMobileOpen, setIsMobileOpen, isLeftSidebarOpen, setIsLeftSidebarOpen} = useSidebar()

    const [width, setWidth] = useState(250)

    const [isDesktop, setIsDesktop] = useState(false)

    const MIN_WIDTH = 230
    const COLLAPSE_THRESHOLD = 100
    const MINIMIZED_WIDTH = 15

    const [openAccordions, setOpenAccordions] = useState([]);

   const handleOpen = (id) => {
        setOpenAccordions((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    useEffect(() => {
        getAllWorkspacesMemberOf()
        const handleResize = () => {
        setIsDesktop(window.innerWidth >= 1024)
        }
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])


    const handleResize = (event, { size }) => {
        if (size.width < COLLAPSE_THRESHOLD) {
        setIsLeftSidebarOpen(true)
        } else {
        setIsLeftSidebarOpen(false)
        setWidth(size.width)
        }
    }

    function getInitials(name) {
        if (!name) return '';
        const words = name.trim().split(/\s+/);
        if (words.length === 1) return words[0][0]?.toUpperCase();
        return (words[0][0] + words[1][0]).toUpperCase();
    }

    function getAllWorkspacesMemberOf (){
        const allWorkspaces = workspaces.filter((workspace) => workspace.members.includes(currentUser.uid));
        return allWorkspaces
    }

    return (
        <>
        {/* Desktop Sidebar - only shown on lg screens and above */}
        {isDesktop && (
            <div className="relative secondary h-full pl-2 hidden lg:block transition-all duration-300">
            {!isLeftSidebarOpen ? (
                <div style={{ width: `${width}px` }}>
                <ResizableBox
                    width={width}
                    height={Infinity}
                    minConstraints={[MIN_WIDTH, Infinity]}
                    maxConstraints={[300, Infinity]}
                    axis="x"
                    resizeHandles={['e']}
                    onResize={handleResize}
                    className="h-[97vh] relative mt-2"
                    handle={
                    <div className="absolute hover:bg-gray-400 top-1/2 right-0 w-[1px] h-[95vh] transform -translate-y-1/2 cursor-ew-resize z-20" />
                    }
                >
                    <div className="relative h-full pl-1 pr-4 flex flex-col">
                        {/* Sidebar Content */}
                        <div className="flex items-center justify-between h-10 mb-2">
                            <Menu placement="bottom-start" className="w-full">
                                <MenuHandler>
                                    <Button
                                        variant="text"
                                        size="sm"
                                        className="flex items-center text-sm font-semibold justify-between p-1.5 hover:bg-gray-700 gap-2 text-color rounded-lg"
                                        >
                                        <div className="py-0.5 px-1 flex items-center justify-center accent-bg text-sm font-bold text-color rounded-sm">
                                            {getInitials(currentWorkspace?.name)}
                                        </div>
                                        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                                            {isLoading ? 'Loading...' : currentWorkspace?.name ?? 'No Workspace'}
                                        </div>
                                        <ChevronDown size={16} className="text-color-secondary" />
                                    </Button>
                                </MenuHandler>
                                <MenuList className="overlay text-color-secondary backdrop-blur-md w-full p-1 max-w-[230px] border-gray-700">
                                    <MenuItem className="text-color text-sm py-1.5 px-2 flex items-center justify-between hover:bg-gray-700">
                                        Settings
                                        <span className="text-sm text-color-secondary ml-2">G then S</span>
                                    </MenuItem>

                                    {/* Possible addition later on */}
                                    {/* <MenuItem className="text-color text-sm py-1.5 px-2 flex items-center justify-between hover:bg-gray-700">Invite and manage members</MenuItem> */}
                                    <div className="h-px my-1 bg-gray-700" />
                                    <MenuItem className="text-color text-sm py-1.5 px-2 flex items-center justify-between hover:bg-gray-700">Download desktop App</MenuItem>
                                    <div className="h-px my-1 bg-gray-700" />
                                    <Menu
                                        placement="bottom-end"
                                        open={openMenu}
                                        handler={setOpenMenu}
                                        allowHover
                                        >
                                        <MenuHandler className="text-color text-sm py-1.5 px-2 flex items-center justify-between hover:bg-gray-700">
                                            <MenuItem>
                                            Switch workspace
                                            <span className="flex items-center gap-2">
                                                <span className="text-sm text-color-secondary ml-2">O then W</span>
                                                <ChevronUpIcon
                                                    strokeWidth={2.5}
                                                    className={`h-3.5 w-3.5 text-color-secondary transition-transform ${
                                                    openMenu ? "rotate-180 text-color" : ""
                                                    }`}
                                                />
                                            </span>
                                            </MenuItem>
                                        </MenuHandler>
                                        <MenuList className="overlay text-color-secondary backdrop-blur-md w-full p-2 max-w-[230px] border-gray-700 z-50 h-50 overflow-y-auto scrollbar-hide">
                                            <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                                                {currentUser?.email}
                                            </div>
                                            {/* Should use all the workspaces that the user is a member of */}
                                            {getAllWorkspacesMemberOf().map((workspace) => (
                                            <MenuItem className="text-color py-1.5 px-2 text-sm flex gap-2 hover:bg-gray-700" key={workspace.id} onClick={async () => { await changeWorkspace(workspace.id)}}>
                                                <div className="py-0.5 px-1 flex items-center  accent-bg text-sm font-bold text-color rounded-sm">
                                                    {getInitials(workspace?.name)}
                                                </div>
                                                <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                                                    {isLoading ? 'Loading...' : workspace?.name ?? 'No Workspace'}
                                                </div>
                                            </MenuItem>
                                            ))}
                                            <div className="h-px my-1 bg-gray-700" />
                                            <MenuItem className="text-color text-sm py-1.5 px-2 flex items-center justify-between hover:bg-gray-700" onClick={async () => { await navigatePage(`/${workspaceID}/workspace/create`) }}>Create or join a workspace</MenuItem>
                                        </MenuList>
                                    </Menu>
                                    <MenuItem className="text-color text-sm py-1.5 px-2 flex items-center justify-between hover:bg-gray-700" onClick={logout}>
                                        Logout
                                        <span className="text-sm text-color-secondary ml-2">Alt then L</span>
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                            <div className="flex items-center gap-1">
                                <Button variant="text" ripple={true} className="text-color-secondary w-fit p-2 hover:bg-gray-700">
                                    <Search size={16} className="text-color-secondary" />
                                </Button>
                                <Button variant="filled" ripple={true} className="text-color-secondary w-fit p-2 hover:bg-gray-700">
                                    <SquarePen size={16} className="text-color-secondary" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-col justify-between gap-0 h-0 mb-13">
                            <div className="flex items-center gap-1">
                                <Button variant="text" ripple={true} className="flex items-center gap-2 w-full p-2 hover:bg-gray-700">
                                    <Inbox size={16} className="text-color-secondary" />
                                    <p className="text-color text-sm font-semibold">Inbox</p>
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-0 mb-4">
                            <Accordion open={openAccordions.includes(1)} icon={
                                <ChevronDown size={16} className={`text-color-secondary ${openAccordions.includes(1) ? 'rotate-180' : ''}`} id={1} open={openAccordions.includes(1)} />}>
                                <AccordionHeader onClick={() => handleOpen(1)} className="text-sm border-none text-color-secondary hover:bg-gray-700 rounded-md p-1">Workspace</AccordionHeader>
                                <AccordionBody className={`flex flex-col gap-1 ${openAccordions.includes(1) ? 'block' : 'hidden'}`}>
                                    <div className="flex items-center gap-1 mb-1">
                                        <Button variant="text" ripple={true} className="flex items-center gap-2 w-full p-2 hover:bg-gray-700"  onClick={() => navigatePage(`/${workspaceID}/events/all`)}>
                                            <CalendarDays size={16} className="text-color-secondary" />
                                            <p className="text-color text-sm font-semibold">Events</p>
                                        </Button>
                                    </div>
                                   <div className="flex items-center gap-1 mb-1">
                                        <Button variant="text" ripple={true} className="flex items-center gap-2 w-full p-2 hover:bg-gray-700" onClick={() => navigatePage(`/${workspaceID}/profiles/all`) }>
                                            <UserRoundPen size={16} className="text-color-secondary" />
                                            <p className="text-color text-sm font-semibold">Profiles</p>
                                        </Button>
                                    </div>
                                    <div className="flex items-center gap-1 mb-1">
                                        <Button variant="text" ripple={true} className="flex items-center gap-2 w-full p-2 hover:bg-gray-700">
                                            <Layers2 size={16} className="text-color-secondary" />
                                            <p className="text-color text-sm font-semibold">Views</p>
                                        </Button>
                                    </div>
                                    {/* This is more info */}
                                    {/* <div className="flex items-center gap-1">
                                        <Menu placement="bottom-start" className="w-full">
                                            <MenuHandler>
                                                <Button
                                                variant="text"
                                                ripple={true}
                                                className="flex items-center gap-2 w-full p-2 hover:bg-gray-700"
                                                >
                                                <Ellipsis size={16} className="text-color-secondary" />
                                                <p className="text-color text-sm font-semibold">More</p>
                                                </Button>
                                            </MenuHandler>

                                            <MenuList className="flex flex-col overlay text-color-secondary backdrop-blur-md w-full p-1 max-w-[180px] border-gray-700">
                                                <MenuItem className="text-color text-sm p-2 flex items-center gap-2 hover:bg-gray-700">
                                                    <UsersRound size={16} className="text-color-secondary" />
                                                    <p className="text-sm font-semibold">Members</p>
                                                </MenuItem>

                                                <MenuItem className="text-color text-sm p-2 flex items-center gap-2 hover:bg-gray-700">
                                                    <SquareUserRound size={16} className="text-color-secondary" />
                                                    <p className="text-sm font-semibold">Teams</p>
                                                </MenuItem>
                                            </MenuList>
                                        </Menu>
                                    </div> */}
                                </AccordionBody>
                            </Accordion>
                        </div>
                    </div>
                </ResizableBox>
                </div>
            ) : (
                <div
                className="group relative border-r border-gray-500 transition-all duration-300 ease-in-out overflow-hidden"
                style={{ width: `${MINIMIZED_WIDTH}px` }}
                >
                </div>
            )}
            </div>
        )}

        {/* Mobile Sidebar - shown on screens below 1024px */}
        <div
            className={`lg:hidden fixed inset-0 z-50 bg-opacity-20 backdrop-blur-sm transition-opacity duration-300 ${
            isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
            onClick={() => setIsMobileOpen(false)}
        >
            <div
            className={`w-72 h-full secondary p-4 shadow-lg transform transition-transform duration-300 ${
                isMobileOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
            onClick={(e) => e.stopPropagation()}
            >
             <div className="relative h-full pl-1 pr-4 flex flex-col">
                    {/* Sidebar Content */}
                    <div className="flex items-center justify-between h-10 mb-2">
                        <Menu placement="bottom-start" className="w-full">
                            <MenuHandler>
                                <Button
                                    variant="text"
                                    size="sm"
                                    className="flex items-center text-sm font-semibold justify-between p-1.5 hover:bg-gray-700 gap-2 text-color rounded-lg"
                                    >
                                    <div className="py-0.5 px-1 flex items-center justify-center accent-bg text-sm font-bold text-color rounded-sm">
                                        {getInitials(currentWorkspace?.name)}
                                    </div>
                                    <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                                        {isLoading ? 'Loading...' : currentWorkspace?.name ?? 'No Workspace'}
                                    </div>
                                    <ChevronDown size={16} className="text-color-secondary" />
                                </Button>
                            </MenuHandler>
                            <MenuList className="overlay text-color-secondary backdrop-blur-md w-full p-1 max-w-[230px] border-gray-700 z-50">
                                <MenuItem className="text-color text-sm py-1.5 px-2 flex items-center justify-between hover:bg-gray-700">
                                    Settings
                                    <span className="text-sm text-color-secondary ml-2">G then S</span>
                                </MenuItem>

                                {/* Possible addition later on */}
                                {/* <MenuItem className="text-color text-sm py-1.5 px-2 flex items-center justify-between hover:bg-gray-700">Invite and manage members</MenuItem> */}
                                <div className="h-px my-1 bg-gray-700" />
                                <MenuItem className="text-color text-sm py-1.5 px-2 flex items-center justify-between hover:bg-gray-700">Download desktop App</MenuItem>
                                <div className="h-px my-1 bg-gray-700" />
                                <Menu
                                    placement="bottom-end"
                                    open={openMenu}
                                    handler={setOpenMenu}
                                    allowHover
                                    >
                                    <MenuHandler className="text-color text-sm py-1.5 px-2 flex items-center justify-between hover:bg-gray-700">
                                        <MenuItem>
                                        Switch workspace
                                        <span className="flex items-center gap-2">
                                            <span className="text-sm text-color-secondary ml-2">O then W</span>
                                            <ChevronUpIcon
                                                strokeWidth={2.5}
                                                className={`h-3.5 w-3.5 text-color-secondary transition-transform ${
                                                openMenu ? "rotate-180 text-color" : ""
                                                }`}
                                            />
                                        </span>
                                        </MenuItem>
                                    </MenuHandler>
                                    <MenuList className="overlay text-color-secondary backdrop-blur-md w-full p-2 max-w-[230px] border-gray-700 z-50 h-50 overflow-y-auto scrollbar-hide">
                                        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                                            {currentUser?.email}
                                        </div>
                                        {/* Should use all the workspaces that the user is a member of */}
                                        {getAllWorkspacesMemberOf().map((workspace) => (
                                        <MenuItem className="text-color py-1.5 px-2 text-sm flex gap-2 hover:bg-gray-700" key={workspace.id} onClick={async () => { await changeWorkspace(workspace.id)}}>
                                            <div className="py-0.5 px-1 flex items-center  accent-bg text-sm font-bold text-color rounded-sm">
                                                {getInitials(workspace?.name)}
                                            </div>
                                            <div className="overflow-hidden text-ellipsis whitespace-nowrap">
                                                {isLoading ? 'Loading...' : workspace?.name ?? 'No Workspace'}
                                            </div>
                                        </MenuItem>
                                        ))}
                                        <div className="h-px my-1 bg-gray-700" />
                                        <MenuItem className="text-color text-sm py-1.5 px-2 flex items-center justify-between hover:bg-gray-700" onClick={async () => { await navigatePage(`/${workspaceID}/workspace/create`)}}>Create or join a workspace</MenuItem>
                                    </MenuList>
                                </Menu>
                                <MenuItem className="text-color text-sm py-1.5 px-2 flex items-center justify-between hover:bg-gray-700" onClick={logout}>
                                    Logout
                                    <span className="text-sm text-color-secondary ml-2">Alt then L</span>
                                </MenuItem>
                            </MenuList>
                        </Menu>
                        <div className="flex items-center gap-1">
                            <Button variant="text" ripple={true} className="text-color-secondary w-fit p-2 hover:bg-gray-700">
                                <Search size={16} className="text-color-secondary" />
                            </Button>
                            <Button variant="filled" ripple={true} className="text-color-secondary w-fit p-2 hover:bg-gray-700">
                                <SquarePen size={16} className="text-color-secondary" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col justify-between gap-0 h-10 mb-5">
                        <div className="flex items-center gap-1">
                            <Button variant="text" ripple={true} className="flex items-center gap-2 w-full p-2 hover:bg-gray-700">
                                <Inbox size={16} className="text-color-secondary" />
                                <p className="text-color text-sm font-semibold">Inbox</p>
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-0 mb-4">
                        <Accordion open={openAccordions.includes(1)} icon={
                            <ChevronDown size={16} className={`text-color-secondary ${openAccordions.includes(1) ? 'rotate-180' : ''}`} id={1} open={openAccordions.includes(1)} />}>
                            <AccordionHeader onClick={() => handleOpen(1)} className="text-sm border-none text-color-secondary mb-1 hover:bg-gray-700 rounded-md p-1">Workspace</AccordionHeader>
                            <AccordionBody className={`flex flex-col gap-1 ${openAccordions.includes(1) ? 'block' : 'hidden'}`}>
                                <div className="flex items-center gap-1 mb-1">
                                    <Button variant="text" ripple={true} className="flex items-center gap-2 w-full p-2 hover:bg-gray-700"  onClick={() => navigatePage(`/${workspaceID}/events/all`)}>
                                        <CalendarDays size={16} className="text-color-secondary" />
                                        <p className="text-color text-sm font-semibold">Events</p>
                                    </Button>
                                </div>
                                <div className="flex items-center gap-1 mb-1">
                                    <Button variant="text" ripple={true} className="flex items-center gap-2 w-full p-2 hover:bg-gray-700" onClick={() => navigatePage(`/${workspaceID}/profiles/all`) }>
                                        <UserRoundPen size={16} className="text-color-secondary" />
                                        <p className="text-color text-sm font-semibold">Profiles</p>
                                    </Button>
                                </div>
                                <div className="flex items-center gap-1 mb-1">
                                    <Button variant="text" ripple={true} className="flex items-center gap-2 w-full p-2 hover:bg-gray-700">
                                        <Layers2 size={16} className="text-color-secondary" />
                                        <p className="text-color text-sm font-semibold">Views</p>
                                    </Button>
                                </div>
                            </AccordionBody>
                        </Accordion>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default Sidebar