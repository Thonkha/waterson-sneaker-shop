import { useState, useEffect } from 'react';

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const CountdownTimer = ({ targetDate }: { targetDate: string }) => {
    const calculateTimeLeft = (): TimeLeft => {
        const difference = +new Date(targetDate) - +new Date();
        if (difference > 0) {
            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

    // Only calculate time on the client to avoid SSR hydration mismatch
    useEffect(() => {
        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    const Unit = ({ val, label }: { val: number; label: string }) => (
        <div className="flex flex-col items-center">
            <span className="text-3xl font-bold font-outfit text-white w-14 text-center">
                {String(val).padStart(2, '0')}
            </span>
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 mt-1">{label}</span>
        </div>
    );

    // Render placeholder during SSR / before hydration
    if (!timeLeft) {
        return (
            <div className="flex items-center gap-4">
                {['Days', 'Hours', 'Mins', 'Secs'].map((label, i) => (
                    <div key={label} className="flex items-center gap-4">
                        {i > 0 && <span className="text-2xl text-brand-green font-bold -mt-4">:</span>}
                        <div className="flex flex-col items-center">
                            <span className="text-3xl font-bold font-outfit text-white w-14 text-center">--</span>
                            <span className="text-[10px] uppercase tracking-widest text-zinc-400 mt-1">{label}</span>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4">
            <Unit val={timeLeft.days} label="Days" />
            <span className="text-2xl text-brand-green font-bold -mt-4">:</span>
            <Unit val={timeLeft.hours} label="Hours" />
            <span className="text-2xl text-brand-green font-bold -mt-4">:</span>
            <Unit val={timeLeft.minutes} label="Mins" />
            <span className="text-2xl text-brand-green font-bold -mt-4">:</span>
            <Unit val={timeLeft.seconds} label="Secs" />
        </div>
    );
};

export default CountdownTimer;
