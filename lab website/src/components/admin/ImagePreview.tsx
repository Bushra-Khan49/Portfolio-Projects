'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ImageIcon } from 'lucide-react';

interface ImagePreviewProps {
    src?: string;
    alt?: string;
    aspectRatio?: '16/9' | '4/3' | '1/1';
    width?: string | number;
    height?: string | number;
}

/**
 * 🖼️ IMAGE PREVIEW COMPONENT
 * --------------------------
 * A rectangular image preview wrapper with built-in cache-busting
 * ensuring that updated uploads show immediately without page refresh.
 */
export default function ImagePreview({ 
    src, 
    alt = '', 
    aspectRatio = '16/9',
    width = '100%',
    height = 'auto'
}: ImagePreviewProps) {
    const [ts, setTs] = useState<number | null>(null);

    // Update timestamp when src changes to force re-render with new cache-buster
    useEffect(() => {
        setTs(Date.now());
    }, [src]);

    const containerStyle: React.CSSProperties = {
        width,
        height,
        aspectRatio,
        backgroundColor: '#f1f5f9',
        borderRadius: '8px',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
    };

    if (!src) {
        return (
            <div style={containerStyle}>
                <ImageIcon size={32} style={{ color: '#cbd5e1' }} />
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <Image
                src={ts ? `${src}?t=${ts}` : src}
                alt={alt}
                fill
                style={{ objectFit: 'cover' }}
                unoptimized
            />
        </div>
    );
}
