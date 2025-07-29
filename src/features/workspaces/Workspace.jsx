import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/common/Sidebar'
import { useEffect, useState } from 'react'
import { PanelRight } from 'lucide-react'
import { useSidebar } from '../../contexts/SidebarContext'
import MainView from './components/WorkspaceView'

function Workspace() {
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(false)
  const { setIsLeftSidebarOpen, setIsMobileOpen } = useSidebar();

  useEffect(() => {
    const closeListener = () => setIsRightSidebarOpen(false)
    window.addEventListener('closeRightSidebar', closeListener)
    return () => window.removeEventListener('closeRightSidebar', closeListener)
  }, [])


  return (
      <main className="flex-1 h-full relative lg:border lg:border-gray-700 lg:rounded-lg primary ">
        <div className='h-full flex flex-col'>
          <div className="h-10 border-b border-gray-700 px-4 flex items-center justify-between sm:justify-end">
            {/* Sidebar */}
            <div className="flex gap-2 justify-between items-center w-full ">
              <button className="lg:hidden text-color-secondary hover:text-color cursor-pointer transition-colors duration-200" onClick={() => setIsMobileOpen(true)}>
                <PanelRight size={16} />
              </button>
              <button
              className="hidden lg:block text-color-secondary hover:text-color cursor-pointer transition-colors duration-200"
                onClick={() => setIsLeftSidebarOpen(prev => !prev)}
              >
                <PanelRight size={16} />
              </button>
              <button
                className="text-color-secondary hover:text-color cursor-pointer transition-colors duration-200"
                onClick={() => setIsRightSidebarOpen(prev => !prev)}
              >
                <PanelRight size={16} className='rotate-180' />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="h-10 border-b border-gray-700 px-4 flex items-center justify-between sm:justify-end">
            <div className="flex gap-2 justify-between items-center w-full ">
            </div>
          </div>


          {/* Sidebar */}
          <div className="flex flex-1 rounded-lg ">
            <div className="flex-1 rounded-lg">
              {/* Outlet passes sidebar control as context */}
              <MainView isRightSidebarOpen={isRightSidebarOpen}></MainView>
            </div>
          </div>
        </div>
      </main>
  )
}

export default Workspace
