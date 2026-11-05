import { useEffect, useState } from "react";
import { timeFormatter } from "../../lib/timeformatter";

const LiveClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 30000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  const currentTime = timeFormatter.format(time);
  return (
    <div className="flex items-center gap-2 font-mono text-xs text-live">
      <span
        aria-hidden="true"
        className="h-2 w-2 rounded-full bg-live animate-pulse"
      />
      LIVE · {currentTime} IST
    </div>
  );
};

export default LiveClock;
