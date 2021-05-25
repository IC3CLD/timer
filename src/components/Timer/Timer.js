import React, { useEffect, useState, useCallback } from "react";
import { fromEvent, interval, Subject } from "rxjs";
import { takeUntil, debounceTime, buffer, filter, map } from "rxjs/operators";

const Timer = () => {
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState(false);
  
  useEffect(() => {
      const stop$ = new Subject();
    interval(1000)
      .pipe(takeUntil(stop$))
      .subscribe(() => {
        if (status) {
          setCount((val) => val + 1000);
        }
      });
    return () => {
      stop$.next();
      stop$.complete();
    };
  }, [status]);

  const start = useCallback(() => {
    if (status) {
      setStatus(false);
      return setCount(0);
    }
    setStatus(true);
  }, [status]);

  const reset = useCallback(() => {
    setStatus(true);
    setCount(0);
  }, []);

  const wait = useCallback(() => {
    const click = fromEvent(document, "click");
    click
      .pipe(
        buffer(click.pipe(debounceTime(300))),
        map((list) => list.length),
        filter((x) => x === 2)
      )
      .subscribe(() => setStatus(false));
  }, []);

  return (
    <div>
      <div className="timer">
        Timer {new Date(count).toISOString().slice(11, 19)}
      </div>
      <button onClick={start}>Start/Stop</button>
      <button onClick={wait}>Wait</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};

export default Timer;
