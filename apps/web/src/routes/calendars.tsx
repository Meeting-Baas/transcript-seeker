'use client'

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Header } from '@/components/header'
import FullSpinner from '@/components/loader'
import { useApiKey } from '@/hooks/use-api-key'
import { useCalendars } from '@/hooks/use-calendars'
import { useSession } from '@/lib/auth'
import { fetchCalendarEvents } from '@/lib/meetingbaas'
import { Separator } from '@meeting-baas/ui/separator'

export default function CalendarsPage() {
  const navigate = useNavigate()
  const [calendarEvents, setCalendarEvents] = useState([])
  const [isEventsLoading, setIsEventsLoading] = useState(false)

  const { data: session, isPending: isSessionLoading } = useSession()
  const { apiKey: baasApiKey, isLoading: isBaasApiKeyLoading } = useApiKey({ type: 'meetingbaas' })
  const { calendars, isLoading: isCalendarsLoading } = useCalendars({
    baasApiKey: baasApiKey ?? '',
    enabled: !!baasApiKey,
  })

  const isLoading = isSessionLoading || isBaasApiKeyLoading || isCalendarsLoading


  useEffect(() => {
    async function fetchEvents() {
      if (calendars && calendars.length > 0 && baasApiKey) {
        setIsEventsLoading(true)
        try {
          calendars.forEach(async cal => {
            // todo: don't send a lot of requests to the api lol, wait some time
            // also, save in db once data is there, then save the offset then repull data
            // when deleting and adding handle the same
            const events = await fetchCalendarEvents({
              apiKey: baasApiKey,
              calendarId: cal.uuid,
              limit: 100,
              offset: 0
            })
            console.log(events)
          })
        } catch (error) {
          console.error('Error fetching calendar events:', error)
        } finally {
          setIsEventsLoading(false)
        }
      }
    }

    fetchEvents()
  }, [calendars, baasApiKey])

  if (isLoading || isEventsLoading) {
    return <FullSpinner />
  }

  if (!baasApiKey) {
    return (
      <div className="container p-4">
        <p className="text-red-500">
          The MeetingBaas API Key is not configured. Please set it up and try again.
        </p>
      </div>
    )
  }

  return (
    <div className="h-full min-h-[calc(100dvh-81px)]">
      <Header
        path={[
          {
            name: 'Calendars',
          },
        ]}
      />
      <div className="container p-4">
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Calendars</h2>
          <p className="text-muted-foreground">View and manage your calendar events.</p>
        </div>
        <Separator className="my-4" />
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Calendars:</h3>
          <ul>
            {calendars?.map((calendar) => (
              <li key={calendar.uuid}>
                {calendar.name} - {calendar.uuid}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Events:</h3>
          <ul>
            {calendarEvents?.map((event) => (
              <li key={event.id}>{event.title}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
