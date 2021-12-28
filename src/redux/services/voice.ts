import { createApi, fetchBaseQuery, retry } from '@reduxjs/toolkit/query/react'
import Logger from '@/utils/logger';

const wsLogger = new Logger('Websocket')

export type Action = 'listen' | 'download'
export type Arg = {
  voice: string,
  paragraph: string,
  action: Action,
}

// @ref: https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#streaming-data-with-no-initial-request
export const voiceApi = createApi({
  reducerPath: 'voiceApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (build) => ({
    getVoice: build.query({
      // The query is not relevant here as the data will be provided via streaming updates.
      // A queryFn returning an empty array is used, with contents being populated via
      // streaming updates below as they are received.
      queryFn: () => ({ data: [] }),
      async onCacheEntryAdded(
        arg: Arg,
        { updateCachedData, cacheEntryRemoved }
      ) {
        // create a websocket connection when the cache subscription starts
        const ws = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL)

        // when data is received from the socket connection to the server,
        // if it is a message and for the appropriate channel,
        // update our query result with the received message
        ws.addEventListener('message', (evt) => {
          const msg = JSON.parse(evt.data);

          if (typeof msg === 'object' && msg !== null) {
            const audioPath = msg.body.audio_path;
            switch (arg.action) {
              case 'listen': {
                const audio = new Audio(audioPath)
                audio.preload = "auto";
                audio.autoplay = true;
                break;
              }
              case 'download': {
                let a = document.createElement("a");
                //link.download = name;
                a.href = audioPath;
                a.target = '_blank';
                a.download = 'speech.mp3';
                a.click();
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }
              default: {
                wsLogger.log('Unhandled action');
              }
            }
          }

          updateCachedData((draft) => {
            console.log('run update cached data')
            // @ts-ignore
            draft.push(JSON.parse(evt.data))
          })
        })

        ws.addEventListener('open', () => {
          wsLogger.log('Opening a connection...');
          const msg = {
            'text': arg.paragraph,
            'speed': 1.0,
            'voice': arg.voice,
            'full_mp3': 1,
          }
          ws.send(JSON.stringify(msg))
        })

        ws.addEventListener('error', (evt: any) => {
          wsLogger.error(evt);
        })
        
        // cacheEntryRemoved will resolve when the cache subscription is no longer active
        await cacheEntryRemoved
        // perform cleanup steps once the `cacheEntryRemoved` promise resolves
        ws.close()
      },
    }),
  }),
})

export const { useLazyGetVoiceQuery } = voiceApi