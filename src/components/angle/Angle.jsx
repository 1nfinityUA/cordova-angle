import { useState, useCallback, useRef } from 'react';

const Angle = () => {
  const [angle1, setAngle1] = useState({ x: 0, y: 0, z: 0 });
  const [angle2, setAngle2] = useState({ x: 0, y: 0, z: 0 });
  const [angle3, setAngle3] = useState({ x: 0, y: 0, z: 0 });
  const [angle4, setAngle4] = useState({ x: 0, y: 0, z: 0 });
  const [disabled, setDisabled] = useState(true);

  const prev1 = useRef({ x: 0, y: 0, z: 0 });
  const prev2 = useRef({ x: 0, y: 0, z: 0 });
  const prev3 = useRef({ x: 0, y: 0, z: 0 });
  const prev4 = useRef({ x: 0, y: 0, z: 0 });
  const watchID = useRef(null);
  const filter = 0.3;

  function filterFn(angle, prevAngle) {
    return Math.round(angle * filter + prevAngle * (1 - filter));
  }

  const orientationHandle = useCallback(event => {
    const { alpha, beta, gamma } = event;
    const betaFixed = 90 - beta;
    const bettaValue = filterFn(betaFixed, prev4.current.y);
    prev4.current.y = bettaValue;

    setAngle4(gamma > 0 ? { x: 0, y: -bettaValue, z: 0 } : { x: 0, y: bettaValue, z: 0 });
  }, []);

  const motionHandle = useCallback(event => {
    const { x, y, z } = event.accelerationIncludingGravity;
    const angle1z = Math.atan2(x, y) * (180 / Math.PI);
    // const angle1y = Math.round(Math.atan2(x, z) * (180 / Math.PI)); // not right
    // const angle1x = Math.round(Math.atan2(z, y) * (180 / Math.PI));
    const angle2z = (Math.atan(x / y) * 180) / Math.PI;
    // const angle2y = Math.round((Math.atan(x / z) * 180) / Math.PI); // not right
    // const angle2x = Math.round((Math.atan(z / y) * 180) / Math.PI);

    const zValue1 = filterFn(angle1z, prev1.current.z);
    const zValue2 = filterFn(angle2z, prev2.current.z);

    prev1.current.z = zValue1;
    prev2.current.z = zValue2;

    setAngle1({ x: 0, y: 0, z: zValue1 });
    setAngle2({ x: 0, y: 0, z: zValue2 });
  });

  function successMagnit(event) {
    const { x, y, z } = event;
    const angleZ = Math.atan2(x, y) * (180 / Math.PI);
    const zValue = filterFn(angleZ, prev3.current.z);
    prev3.current.z = zValue;

    setAngle3({ x: 0, y: 0, z: zValue });
  }
  function errorMagnit(err) {
    console.log(err);
  }

  function start() {
    window.addEventListener('deviceorientation', orientationHandle);
    window.addEventListener('devicemotion', motionHandle);
    watchID.current = window.cordova.plugins.magnetometer.watchReadings(successMagnit, errorMagnit);
    setDisabled(false);
  }
  function stop() {
    window.location.reload();
    setDisabled(true);
  }

  function calcLeft(angle) {
    const maxLeft = 50;
    const maxRight = 100;
    if (angle < 0) {
      return maxLeft + (angle / 90) * maxLeft;
    }
    return maxLeft + (angle / 90) * (maxRight - maxLeft);
  }

  return (
    <div className='text-center w-full mt-10 px-4'>
      <ul className='w-full'>
        <li className='relative text-2xl font-bold flex flex-col border-b-2 border-green-400 pb-5'>
          <p>angle 1 (old ote):</p>
          <p className='text-4xl mt-4'>{angle1.z}°</p>
          <p
            style={{
              height: '2rem',
              width: '4px',
              position: 'absolute',
              bottom: '-1rem',
              backgroundColor: 'red',
              left: `calc(${calcLeft(angle1.z)}% - 2px)`,
            }}
          ></p>
        </li>
        <li className='relative text-2xl font-bold mt-5 flex flex-col border-b-2 border-green-400 pb-5'>
          <p>angle 2 (new ote):</p>
          <p className='text-4xl mt-4'>{angle2.z}°</p>
          <p
            style={{
              height: '2rem',
              width: '4px',
              position: 'absolute',
              bottom: '-1rem',
              backgroundColor: 'red',
              left: `calc(${calcLeft(angle2.z)}% - 2px)`,
            }}
          ></p>
        </li>
        <li className='relative text-2xl font-bold mt-5 flex flex-col border-b-2 border-green-400 pb-5'>
          <p>angle 2 (magnet):</p>
          <p className='text-4xl mt-4'>{angle3.z}°</p>
          <p
            style={{
              height: '2rem',
              width: '4px',
              position: 'absolute',
              bottom: '-1rem',
              backgroundColor: 'red',
              left: `calc(${calcLeft(angle3.z)}% - 2px)`,
            }}
          ></p>
        </li>
        <li className='relative text-2xl font-bold mt-5 flex flex-col border-b-2 border-green-400 pb-5'>
          <p>angle 2 (gyroscope):</p>
          <p className='text-4xl mt-4'>{angle4.y}°</p>
          <p
            style={{
              height: '2rem',
              width: '4px',
              position: 'absolute',
              bottom: '-1rem',
              backgroundColor: 'red',
              left: `calc(${calcLeft(angle4.y)}% - 2px)`,
            }}
          ></p>
        </li>
      </ul>
      <div className='w-full flex justify-around mt-10'>
        <button
          disabled={!disabled}
          onClick={start}
          className='text-2xl py-2 px-4 rounded bg-green-400 hover:bg-green-600 disabled:bg-green-100'
        >
          start
        </button>
        <button
          disabled={disabled}
          onClick={stop}
          className='text-2xl py-2 px-4 rounded bg-green-400 hover:bg-green-600 disabled:bg-green-100'
        >
          stop
        </button>
      </div>
    </div>
  );
};

export default Angle;
