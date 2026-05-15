'use client';

import { useState, useEffect } from 'react';
import styles from './LabProgress.module.css';
import { Calendar, User, Clock, MapPin } from 'lucide-react';
import { useLiveData } from '@/hooks/useLiveData';

interface MeetingData {
    title: string;
    number: string;
    purpose: string;
    date: string;
    time: string;
    location: string;
}

interface Presenter {
    id: string;
    presenter: string;
    topic: string;
    time: string;
}

interface SessionsData {
    meeting: MeetingData;
    presenters: Presenter[];
}

const initialSessions: SessionsData = {
    meeting: {
        title: 'Lab Meeting',
        number: '1st',
        purpose: '',
        date: '2026-04-15',
        time: '10:00',
        location: 'Building 4, Wing B',
    },
    presenters: [],
};

export default function LabProgress() {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isPast, setIsPast] = useState(false);
    const data = useLiveData<SessionsData>('sessions', initialSessions);

    // Dynamic countdown based on admin-set date
    useEffect(() => {
        if (!data?.meeting?.date) return;

        const { date, time } = data.meeting;
        const targetDate = new Date(`${date}T${time || '00:00'}:00`).getTime();

        const updateTimer = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                setIsPast(true);
                return;
            }

            setIsPast(false);

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [data]);

    // Format date for display
    const meetingDateDisplay = data?.meeting?.date
        ? new Date(data.meeting.date + 'T00:00:00').toLocaleDateString('en-US', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
        })
        : 'To be announced';

    return (
        <section id="progress" className={`section ${styles.progressSection}`}>
            <div className="container">

                <div className={styles.header}>
                    <h2 className="section-title" style={{ textAlign: 'center', margin: 0, color: 'var(--color-text-inverse)' }}>Upcoming Meetings &amp; Sessions</h2>
                </div>

                <div className={styles.content}>

                    {/* Timer on Left */}
                    <div className={styles.timerSection}>
                        <div className={styles.timerHeader}>
                            <Calendar className={styles.timerIcon} size={28} />
                            <h3 className={styles.timerTitle}>
                                {data?.meeting?.number || ''} Meeting Countdown
                            </h3>
                            <p className={styles.timerSubtitle}>
                                {data?.meeting?.title || 'Loading...'}
                            </p>
                            <p className={styles.timerSubtitle} style={{ fontSize: '0.8rem', marginTop: '0.25rem', opacity: 0.8 }}>
                                <MapPin size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '0.25rem' }} />
                                {data?.meeting?.location || ''}
                            </p>
                        </div>

                        {isPast ? (
                            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                <p style={{ fontSize: '1.1rem', fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginBottom: '0.5rem' }}>This session has concluded</p>
                                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>{meetingDateDisplay}</p>
                            </div>
                        ) : (
                            <>
                                <div className={styles.timerGrid}>
                                    <div className={styles.timeBox}>
                                        <span className={styles.timeVal}>{String(timeLeft.days).padStart(2, '0')}</span>
                                        <span className={styles.timeLabel}>Days</span>
                                    </div>
                                    <div className={styles.timeBox}>
                                        <span className={styles.timeVal}>{String(timeLeft.hours).padStart(2, '0')}</span>
                                        <span className={styles.timeLabel}>Hours</span>
                                    </div>
                                    <div className={styles.timeBox}>
                                        <span className={styles.timeVal}>{String(timeLeft.minutes).padStart(2, '0')}</span>
                                        <span className={styles.timeLabel}>Mins</span>
                                    </div>
                                    <div className={styles.timeBox}>
                                        <span className={styles.timeVal}>{String(timeLeft.seconds).padStart(2, '0')}</span>
                                        <span className={styles.timeLabel}>Secs</span>
                                    </div>
                                </div>

                                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginTop: '1rem' }}>
                                    {meetingDateDisplay}
                                </p>
                            </>
                        )}
                    </div>

                    {/* Scrollable Presentations on Right */}
                    <div className={styles.sessionsWrapper}>
                        <h4 className={styles.sessionsTitle}>
                            Presentations for {meetingDateDisplay}
                        </h4>
                        <div className={styles.sessionsList}>
                            {data?.presenters?.map((session: Presenter) => (
                                <div key={session.id} className={styles.sessionCard}>
                                    <h3 className={styles.sessionCardTitle}>{session.topic}</h3>
                                    <div className={styles.sessionDetails}>
                                        <div className={styles.detailItem}>
                                            <User size={16} className={styles.detailIcon} />
                                            <span>{session.presenter}</span>
                                        </div>
                                        <div className={styles.detailItem}>
                                            <Clock size={16} className={styles.detailIcon} />
                                            <span className={styles.sessionTime}>{session.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(!data?.presenters || data.presenters.length === 0) && (
                                <div className={styles.sessionCard} style={{ textAlign: 'center', opacity: 0.7 }}>
                                    <p>Presentations will be announced soon.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}
