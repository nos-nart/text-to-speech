import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react'
import Logger from '@/utils/logger';

const wsLogger = new Logger('Websocket')

export const voiceApi = createApi({
  reducerPath: 'voiceApi',
  baseQuery: retry(
    fetchBaseQuery({ baseUrl: '/' }),
    { maxRetries: 5 }
  ),
  endpoints: (build) => ({
    getVoice: build.query({
      query: () => `/tts_api`,
      async onCacheEntryAdded(
        arg: { voice: string, paragraph: string },
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        // create a websocket connection when the cache subscription starts
        const ws = new WebSocket("ws://125.214.0.120:81")
        try {
          // wait for the initial query to resolve before proceeding
          await cacheDataLoaded

          // when data is received from the socket connection to the server,
          // if it is a message and for the appropriate channel,
          // update our query result with the received message
          const listener = (event: MessageEvent) => {
            const data = JSON.parse(event.data)
            wsLogger.log('event -> ', event)

            updateCachedData((draft) => {
              draft.push(data)
            })
          }

          const onOpenWs = () => {
            wsLogger.log('Opening a connection...');
            const msg = {
              'text': arg.paragraph,
              'speed': 1.0,
              'voice': arg.voice,
              'full_mp3': 1,
            }
            ws.send(JSON.stringify(msg))
          }

          const onCloseWs = () => {
            wsLogger.log('Close connection!');
          }

          const onErrorWs = (evt: any) => {
            wsLogger.error(evt);
          }

          ws.addEventListener('close', onCloseWs);
          ws.addEventListener('error', onErrorWs);
          ws.addEventListener('message', listener);
          ws.addEventListener('open', onOpenWs);
        } catch {
          // no-op in case `cacheEntryRemoved` resolves before `cacheDataLoaded`,
          // in which case `cacheDataLoaded` will throw
        }
        // cacheEntryRemoved will resolve when the cache subscription is no longer active
        await cacheEntryRemoved
        // perform cleanup steps once the `cacheEntryRemoved` promise resolves
        ws.close()
      },
    }),
  }),
})

export const { useLazyGetVoiceQuery } = voiceApi