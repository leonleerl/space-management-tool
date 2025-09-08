import { useEffect, useState } from "react";
import { message } from "antd";

export function useRoom(location: string) {
    const [roomOptions, setRoomOptions] = useState<string[]>([]);

    useEffect(() => {
    fetch(`/api/room?location=${location}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((rooms: Array<{ roomNo?: string | null }>) => {
        const options = Array.isArray(rooms)
          ? rooms
              .map((r) => (r.roomNo ?? '').toString().trim())
              .filter((v) => v.length > 0)
          : [];
        setRoomOptions(options);
      })
      .catch((err) => {
        console.error(err);
        message.error('Failed to load rooms');
      });
  }, [location]);

  return { roomOptions };
}