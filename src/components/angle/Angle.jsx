import { useState, useCallback } from 'react';

const Angle = () => {
  const [angle, setAngle] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [disabled, setDisabled] = useState(true);

  const filter = 0.3;

  function filterFn(angle, prevAngle) {
    return Math.round(angle * filter + prevAngle * (1 - filter));
  }

  const orientationHandle = useCallback(event => {
    const { alpha, beta, gamma } = event;
    setAngle({ alpha: Math.round(alpha), beta: Math.round(beta), gamma: Math.round(gamma) });
  }, []);

  function start() {
    window.addEventListener('deviceorientation', orientationHandle);
    setDisabled(false);
  }
  function stop() {
    window.removeEventListener('deviceorientation', orientationHandle);
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
        <li className='relative text-2xl font-bold mt-5 flex flex-col border-b-2 border-green-400 pb-5'>
          <p>angle rotation: </p>
          <div className='flex justify-around w-full'>
            <p className='text-4xl mt-4'>z {angle.alpha}°</p>
            <p className='text-4xl mt-4'>x {angle.beta}°</p>
            <p className='text-4xl mt-4'>y {angle.gamma}°</p>
          </div>
          <p
            style={{
              height: '2rem',
              width: '4px',
              position: 'absolute',
              bottom: '-1rem',
              backgroundColor: 'red',
              left: `calc(${calcLeft(angle.beta)}% - 2px)`,
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
