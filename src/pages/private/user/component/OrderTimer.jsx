import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { Clock } from 'lucide-react';

const OrderTimer = ({ createdAt, onExpire }) => {
    const [timeLeft, setTimeLeft] = useState("");
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        // অর্ডারের সময় থেকে ৩০ মিনিট যোগ করা
        const expiryTime = moment(createdAt).add(30, 'minutes');

        const calculateTime = () => {
            const now = moment();
            const diff = expiryTime.diff(now);

            if (diff <= 0) {
                setTimeLeft("00:00");
                setIsExpired(true);
                if (onExpire) onExpire();
                return false;
            }

            const duration = moment.duration(diff);
            const mins = String(Math.floor(duration.asMinutes())).padStart(2, '0');
            const secs = String(duration.seconds()).padStart(2, '0');
            setTimeLeft(`${mins}:${secs}`);
            return true;
        };

        const timer = setInterval(() => {
            const active = calculateTime();
            if (!active) clearInterval(timer);
        }, 1000);

        calculateTime(); // মাউন্ট হওয়ার সাথে সাথে একবার কল করা

        return () => clearInterval(timer);
    }, [createdAt, onExpire]);

    return (
        <div className={`flex items-center gap-3 p-4 rounded-2xl transition-all ${isExpired ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-600'}`}>
            <div className='text-center'>
                <p className="text-[10px] font-bold uppercase tracking-wider leading-none">
                    {isExpired ? "Time Expired" : "Order Confirm In"}
                </p>
                <p className="text-xl font-black font-mono leading-none mt-1 flex justify-between gap-2">
                    <span>
                        {timeLeft}
                    </span>
                    <span className='lowercase text-sm'>
                        min
                    </span>
                </p>
            </div>
        </div>
    );
};

export default OrderTimer;