import React, { useEffect, useRef, useState } from 'react'
import Sidebar from '../common/Sidebar'
import { Outlet } from 'react-router'
import { useSidebar } from '../../contexts/SidebarContext';
import RouteInit from "../../routes/RouteInit.jsx";

function Container() {
      const [isMobileOpen, setIsMobileOpen] = useState(false)
      const { isLeftSidebarOpen, setIsLeftSidebarOpen } = useSidebar();
      const timeout = useRef(null);

      useEffect(() => {
        let sequence = [];

        const handleKeyDown = (e) => {
          const key = e.key.toLowerCase();

          if (e.altKey && key === 'l') {
            e.preventDefault();
            console.log('Logout triggered');
            return;
          }

          sequence.push(key);
          if (timeout.current) clearTimeout(timeout.current);

          timeout.current = setTimeout(() => {
            sequence = [];
          }, 1000);

          const combo = sequence.join('');

          switch (combo) {
            case 'gs':
              console.log('Open Settings triggered');
              sequence = [];
              break;
            default:
              if (sequence.length > 2) sequence.shift();
          }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
          if (timeout.current) clearTimeout(timeout.current);
          window.removeEventListener('keydown', handleKeyDown);
        };
      }, []);


    return (
        <div className="flex h-full secondary overflow-auto">
        <RouteInit />
        <Sidebar
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
            isLeftSidebarOpen={isLeftSidebarOpen}
            setIsLeftSidebarOpen={setIsLeftSidebarOpen}
        />

        <div className="h-svh w-svw lg:py-2 lg:pr-2">
            <Outlet />
        </div>

        </div>
    )
}

export default Container