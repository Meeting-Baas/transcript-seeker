import './player.css';

import type { MediaPlayerInstance, MediaProviderAdapter } from '@vidstack/react';
import { useEffect, useRef } from 'react';
import { isHLSProvider, MediaPlayer, MediaProvider } from '@vidstack/react';
import {
  DefaultAudioLayout,
  defaultLayoutIcons,
  DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default';
import { toast } from 'sonner';

interface PlayerProps {
  setPlayer: (player: MediaPlayerInstance) => void;
  src: string;
  onTimeUpdate: (time: number) => void;
  assetTitle: string;
}

export function Player({ setPlayer, src, onTimeUpdate, assetTitle }: PlayerProps) {
  const player = useRef<MediaPlayerInstance>(null);

  useEffect(() => {
    // Subscribe to state updates.

    return player.current!.subscribe(({ currentTime, error }) => {
      onTimeUpdate(currentTime);

      if (error?.code === 3) {
        toast.error('Oops! Something went wrong!');
      }
    });
  }, []);

  function onProviderChange(provider: MediaProviderAdapter | null) {
    // We can configure provider's here.
    if (isHLSProvider(provider)) {
      provider.library = () => import('hls.js');
    }
  }

  // We can listen for the `can-play` event to be notified when the player is ready.
  function onCanPlay() {
    setPlayer(player.current!);
  }

  return (
    <>
      <MediaPlayer
        className="player"
        title={assetTitle}
        src={src}
        crossOrigin
        playsInline
        onProviderChange={onProviderChange}
        onCanPlay={onCanPlay}
        ref={player}
      >
        <MediaProvider>
          {/* 

			  // TODO: extract poster using ffmpeg? Or define a Poster
		<Poster
            className="vds-poster"
            src="https://files.vidstack.io/sprite-fight/poster.webp"
            alt="Girl walks into campfire with gnomes surrounding her friend ready for their next meal!"
          /> */}
        </MediaProvider>

        {/* Layouts */}
        <DefaultAudioLayout icons={defaultLayoutIcons} />
        <DefaultVideoLayout
          icons={defaultLayoutIcons}
          // thumbnails="https://files.vidstack.io/sprite-fight/thumbnails.vtt"
        />
      </MediaPlayer>
    </>
  );
}
