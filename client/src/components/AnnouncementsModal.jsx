import React, { useState, useEffect } from 'react';
import { Bell, Calendar, ShieldAlert, Award } from 'lucide-react';
import { api } from '../api/client';

export default function AnnouncementsModal({ isOpen, onClose }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      api.getAnnouncements()
        .then(data => setAnnouncements(data.announcements || []))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-dialog">
        <div className="card-header-styled">
          <h3>
            <Bell size={18} color="#0284c7" />
            <span>University Circulars & Academic Orders</span>
          </h3>
          <button 
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '1.25rem', maxHeight: '70vh', overflowY: 'auto' }}>
          {announcements.map(ann => (
            <div key={ann.id} style={{ border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '1rem', marginBottom: '0.85rem', background: ann.priority === 'High' ? '#fffbeb' : '#ffffff' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                <strong style={{ fontSize: '0.92rem', color: 'var(--text-main)' }}>{ann.title}</strong>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-full)',
                  background: ann.priority === 'High' ? '#fef3c7' : '#e0f2fe',
                  color: ann.priority === 'High' ? '#b45309' : 'var(--sky-primary)'
                }}>
                  {ann.priority}
                </span>
              </div>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {ann.content}
              </p>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.6rem', display: 'flex', justifyContent: 'space-between' }}>
                <span>Issued by: <strong>{ann.postedBy}</strong></span>
                <span>Date: {ann.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
