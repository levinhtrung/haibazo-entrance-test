import { useEffect, useState } from 'react';

export default function GameUI() {
    const [numbers, setNumbers] = useState([]);
    const [points, setPoints] = useState(0);
    const [time, setTime] = useState(0);
    const [autoPlay, setAutoPlay] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    const getRandomPosition = (max) => Math.random() * max;

    const generateRandomNumbers = () => {
        const randomNumbers = Array.from({ length: points }, (_, i) => ({
            id: i + 1,
            x: getRandomPosition(250),
            y: getRandomPosition(350),
            clickedTime: null
        }));
        setNumbers(randomNumbers);
        setAutoPlay(false);
        setIsPlaying(true);
        setIsCompleted(false);
        setTime(0);
    };

    useEffect(() => {
        let timer;
        if (isPlaying) {
            timer = setInterval(() => {
                setTime((prevTime) => +(prevTime + 0.1).toFixed(1));
            }, 100);
        }
        return () => clearInterval(timer);
    }, [isPlaying]);

    const handleNumberClick = (id) => {
        setNumbers(numbers.map(num =>
            num.id === id ? { ...num, clickedTime: time.toFixed(1), fading: true } : num
        ));

        if (numbers.filter(num => num.clickedTime === null).length === 1) {
            setIsPlaying(false);
            setIsCompleted(true);
        }

        setTimeout(() => {
            setNumbers((prev) => prev.filter(num => num.id !== id));
        }, 500);
    };

    const toggleAutoPlay = () => {
        setAutoPlay(!autoPlay);
    };

    useEffect(() => {
        let autoPlayInterval;
        if (autoPlay && numbers.length) {
            autoPlayInterval = setInterval(() => {
                const nextNumber = numbers.find(num => num.clickedTime === null);
                if (nextNumber) {
                    handleNumberClick(nextNumber.id);
                } else {
                    clearInterval(autoPlayInterval);
                }
            }, 800);
        }

        return () => clearInterval(autoPlayInterval);
    }, [autoPlay, numbers]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 border border-gray-300 shadow-md">
                {isCompleted && (
                    <div className="text-green-500 text-lg font-bold mb-2">
                        ALL CLEARED
                    </div>
                )}

                <h1 className="text-lg font-bold mb-4">LET'S PLAY</h1>

                <div className="mb-4">
                    <label className="block text-sm font-medium">Points:</label>
                    <input
                        type="number"
                        value={points || ''}
                        onChange={(e) => setPoints(Math.min(2000, Math.max(1, Number(e.target.value))))}
                        className="border border-gray-300 p-1 w-full"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium">Time:</label>
                    <input
                        type="text"
                        value={`${time.toFixed(1)}s`}
                        readOnly
                        className="border border-gray-300 p-1 w-full"
                    />
                </div>

                <div className="flex space-x-2 mb-4">
                    {!isPlaying ? (
                        <button
                            onClick={generateRandomNumbers}
                            className="bg-gray-200 px-4 py-2 border border-gray-300"
                        >
                            Play
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={generateRandomNumbers}
                                className="bg-gray-200 px-4 py-2 border border-gray-300"
                            >
                                Restart
                            </button>
                            <button
                                onClick={toggleAutoPlay}
                                className="bg-gray-200 px-4 py-2 border border-gray-300"
                            >
                                {autoPlay ? 'Auto Play OFF' : 'Auto Play ON'}
                            </button>
                        </>
                    )}
                </div>

                <div
                    className="border border-gray-300 p-4 relative"
                    style={{ width: 300, height: 400 }}
                >
                    {numbers.map((num) => (
                        <div
                            key={num.id}
                            className={`random-number absolute text-center font-bold text-lg border border-black rounded-full w-12 h-12 flex flex-col items-center justify-center
                            ${num.fading ? 'opacity-50' : 'bg-red-500 text-white'}`}
                            style={{ top: num.y, left: num.x }}
                            onClick={() => handleNumberClick(num.id)}
                        >
                            {num.id}
                            {num.clickedTime && (
                                <div className="text-xs mt-1">{num.clickedTime}s</div>
                            )}
                        </div>
                    ))}
                </div>

                {!isCompleted && (
                    <div className="mt-4 text-sm">
                        Next: {numbers.find(num => num.clickedTime === null)?.id || 'None'}
                    </div>
                )}
            </div>
        </div>
    );
}
