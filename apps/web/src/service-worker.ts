import { getMeetings } from '@/queries';
import { clientsClaim } from 'workbox-core';
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute,
} from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';

declare let self: ServiceWorkerGlobalScope;

// self.__WB_MANIFEST is default injection point
precacheAndRoute(self.__WB_MANIFEST);

// clean old assets
cleanupOutdatedCaches();

let allowlist: undefined | RegExp[];
if (import.meta.env.DEV) allowlist = [/^\/$/];

// to allow work offline
registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html'), { allowlist }));

self.skipWaiting();
clientsClaim();

// // todo: switch to background sync api
// // Function to check for loading meetings
// async function checkLoadingMeetings() {
//   try {
//     const meetings = await getMeetings()
//     console.log(meetings)
//     const loadingMeetings = meetings.filter(meeting => meeting.status === 'loading')
//     if (loadingMeetings.length > 0) {
//       console.log('Meetings with loading status:', loadingMeetings)
//     }
//   } catch (error) {
//     console.error('Error checking for loading meetings:', error)
//   }
// }

// // Set up periodic sync (every 10 seconds)
// const SYNC_INTERVAL = 10000 // 10 seconds

// setInterval(checkLoadingMeetings, SYNC_INTERVAL)

// // Initial check when the service worker starts
// checkLoadingMeetings()
