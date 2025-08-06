import { onSnapshot, collection } from 'firebase/firestore';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';

import { db } from './services/firebase.js';
import { useEffect } from 'react';

import Login from './features/auth/Login.jsx';
import SignUp from './features/auth/SignUp.jsx';
import Workspace from './features/workspaces/Workspace.jsx';
import CreateWorkspace from './features/workspaces/CreateWorkspace.jsx';

import { AuthProvider } from './contexts/AuthContext.jsx';
import { LoaderProvider } from './contexts/LoaderContext.jsx';
import RouteChangeLoader from './routes/RouterChangeLoader.jsx';
import ProtectedRoute from './routes/ProtectedRoutes.jsx';

import NotFound from './routes/NotFound.jsx';
import GeneralError from './routes/GeneralError.jsx';
import Events from './features/events/Events.jsx';
import { WorkspaceProvider } from './contexts/WorkspaceContext.jsx';
import Container from './components/layout/Container.jsx';
import { SidebarProvider } from './contexts/SidebarContext.jsx';
import WorkspaceView from './features/workspaces/components/WorkspaceView.jsx';
import EventView from './features/events/components/EventView.jsx';
import EventViewAll from './features/events/components/EventViewAll.jsx';
import RouteInit from './routes/RouteInit.jsx';
import { Toaster } from 'sonner';
import Onboarding from './features/onboarding/Onboarding.jsx';
import OnboardingStep1 from './features/onboarding/components/OnboardingStep1.jsx';
import OnboardingStep2 from './features/onboarding/components/OnboardingStep2.jsx';
import OnboardingStep3 from './features/onboarding/components/OnboardingStep3.jsx';
import { OnboardingProvider } from './contexts/OnboardingContext.jsx';
import RedirectToOnboardingStep from './routes/RedirectToOnboardingStep.jsx';
import { EventProvider } from './contexts/EventContext.jsx';
import { ParticipantsProvider } from './contexts/ParticipantsContext.jsx';
import { ProfilesProvider } from './contexts/ProfilesContext.jsx';
import Profiles from './features/profiles/Profiles.jsx';
import ProfileViewAll from './features/profiles/components/ProfileViewAll.jsx';
import ProfileView from './features/profiles/components/ProfileView.jsx';
import AddParticipantPage from './features/public/AddParticipantPage.jsx';
import PublicCheckInPage from './features/public/PublicCheckInPage.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <GeneralError />, // shows when a route fails
    children: [
      {
        path: "",
        element: <Login />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "attendance-tracker/",
        element: <ProtectedRoute><Container /></ProtectedRoute>,
      },
      {
        path: "attendance-tracker/",
        element: <ProtectedRoute><Container /></ProtectedRoute>,
        children: [
          {
            path: ":workspaceURL",
            element: <ProtectedRoute><Workspace /></ProtectedRoute>,
            children: [
              {
                path: ":mainTab",
                element: <ProtectedRoute><WorkspaceView /></ProtectedRoute>
              }
            ]
          },
        ],
      },
      {
        path: "attendance-tracker/:workspaceURL/",
        element: <ProtectedRoute><Container /></ProtectedRoute>,
        children: [
          {
            path: "events",
            element: <ProtectedRoute><Events /></ProtectedRoute>,
            children: [
              {
                path: "all",
                element: <ProtectedRoute><EventViewAll /></ProtectedRoute>
              },
              {
                path: ":eventID",
                element: <ProtectedRoute><EventView /></ProtectedRoute>
              },
            ]
          },
          {
            path: "profiles",
            element: <ProtectedRoute><Profiles /></ProtectedRoute>,
            children: [
              {
                path: "all",
                element: <ProtectedRoute><ProfileViewAll /></ProtectedRoute>
              },
              {
                path: ":profileID",
                element: <ProtectedRoute><ProfileView /></ProtectedRoute>
              },
            ]
          }
        ]
      },
      {
        path: "attendance-tracker/workspace/create",
        element: <ProtectedRoute><CreateWorkspace /></ProtectedRoute>,
      },
      {
        path: "public/:workspaceID/:eventID/register",
        element: <AddParticipantPage/>
      },
      {
        path: "public/:workspaceID/:eventID/check-in",
        element: <PublicCheckInPage />
      },
      {
        path: "*", // Catch-all route (404)
        element: <NotFound />,
      },
      {
        path: "onboarding/",
        element: <ProtectedRoute><Onboarding /></ProtectedRoute>,
        children: [
          {
          path: "step/1",
          element: <ProtectedRoute><OnboardingStep1 /></ProtectedRoute>,
          },
          {
          path: "step/2",
          element: <ProtectedRoute><OnboardingStep2 /></ProtectedRoute>,
          },
          {
          path: "step/3",
          element: <ProtectedRoute><OnboardingStep3 /></ProtectedRoute>,
          },
        ]
      }
    ]
  }
]);

function App() {
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      console.log(snapshot);
    });
    return () => unsubscribe();
  }, []);

  return (
    <LoaderProvider>
      <AuthProvider>
        <OnboardingProvider>
          <WorkspaceProvider>
            <ProfilesProvider>
            <EventProvider>
              <ParticipantsProvider>
                <SidebarProvider>
                  <div className='App primary'>
                    <Toaster toastOptions={{
                      classNames: {
                        toast: 'overlay !border-gray-600',
                        title: 'text-color',
                        description: 'text-color',
                        icon: 'text-color',
                      },
                    }}/>
                  <RouterProvider router={router} />
                  {/* <RouteInit /> */}
                  <RouteChangeLoader />
                  </div>
                </SidebarProvider>
              </ParticipantsProvider>
            </EventProvider>
            </ProfilesProvider>
          </WorkspaceProvider>
        </OnboardingProvider>
      </AuthProvider>
    </LoaderProvider>
  );
}

export default App;
