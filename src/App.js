import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [auditData, setAuditData] = useState({});
  const [currentPhotoSection, setCurrentPhotoSection] = useState('');
  const [restaurantName, setRestaurantName] = useState('');
  const [auditorName, setAuditorName] = useState('');
  const [auditDate, setAuditDate] = useState('');
  const [auditTime, setAuditTime] = useState('');
  const [modalImage, setModalImage] = useState('');

  const sections = [
    {
      id: 'doors',
      title: 'DOORS',
      items: [
        { text: 'HOH Back Door - STOP sign (1 hour gate notice)', dsi: '005-1866' },
        { text: 'HOH Back Door - Door Alarm sign', dsi: '005-1493' },
        { text: 'Office Door - TM Referral Poster', dsi: '005-1817TM' },
        { text: 'Office Door - TM Hotline Flyer', dsi: '001-004' },
        { text: 'Office Door - E-Verify & Right to Work posted' },
        { text: 'Front doors have NO postings (verified)' },
        { text: 'To-Go doors have NO postings (verified)' }
      ]
    },
    {
      id: 'togo',
      title: 'TO-GO AREA',
      items: [
        { text: 'Staging area labels (PAID, NOT PAID, DELIVERY)', dsi: '005-1462B' },
        { text: '"Please Go to the Bar" sign available' },
        { text: 'Tip jar placed on counter in guest view' },
        { text: 'To-Go parking signs installed outside' },
        { text: 'All staging shelves properly labeled' }
      ]
    },
    {
      id: 'cookline',
      title: 'COOK LINE - FLAT TOP',
      items: [
        { text: 'Flat top timers installed (SET OF 4)' },
        { text: 'Steak cooking guide visible and legible' },
        { text: 'Temperature dial at 400°F marking' }
      ]
    },
    {
      id: 'fryer',
      title: 'FRYER',
      items: [
        { text: 'Fryer Help button stickers applied' },
        { text: 'Fryer Stats temperature guides posted' },
        { text: 'Henny Penny button stickers installed' },
        { text: 'Surface cleaned before sticker application' }
      ]
    },
    {
      id: 'buntoaster',
      title: 'BUN TOASTER',
      items: [
        { text: 'SET TO 400°F sticker applied' },
        { text: 'TURN ON 10:30 AM reminder visible' },
        { text: 'Sticker valid for APW Bun Toaster (verified)' }
      ]
    },
    {
      id: 'microwave',
      title: 'MICROWAVE',
      items: [
        { text: 'Zone 1 OR Zone 2 strip applied' },
        { text: 'Programming instructions available' },
        { text: 'Timer presets match sticker guide' }
      ]
    },
    {
      id: 'hothold',
      title: 'CK HOT HOLD UNIT',
      items: [
        { text: '15 MINUTE MAX HOLD sign posted' },
        { text: 'TURN ON AT 10:30 AM reminder visible' }
      ]
    },
    {
      id: 'prep',
      title: 'PREP & DISH',
      items: [
        { text: '3-compartment sink labels installed' },
        { text: 'Prep scale labels (Protein/Vegetable/Other)' },
        { text: 'Rethermalizer 30 MIN and 60 MIN labels' },
        { text: 'Dish area glassware organization labels' },
        { text: 'Steak markers (Medium Rare - 5 total)' },
        { text: 'Dredge shakers (CK Cajun - 10 total)' }
      ]
    },
    {
      id: 'qa',
      title: 'QA & PASSOUT',
      items: [
        { text: 'Monin Pump Guide posted' },
        { text: 'Strawberry Lemonade chart visible' },
        { text: 'Sweet/Unsweet Tea labels applied' },
        { text: 'Dessert station microwave settings posted' },
        { text: 'Dessert Rail Chart installed' },
        { text: 'Induction buttons covered (except 60 seconds)' },
        { text: 'Soup rail organization labels' }
      ]
    },
    {
      id: 'ice',
      title: 'ICE MACHINE & HOH',
      items: [
        { text: 'Ecolab Hand-Washing Sticker installed' },
        { text: 'DO NOT HIT warning label applied' },
        { text: 'HOH Shelf Labels installed', dsi: '005-1461' },
        { text: 'All hand wash sinks have stickers (excluding restrooms)' }
      ]
    }
  ];

  useEffect(() => {
    const initialData = {};
    sections.forEach(section => {
      initialData[section.id] = {
        status: '',
        checkedItems: [],
        notes: '',
        photos: [],
        expanded: false
      };
    });
    setAuditData(initialData);

    const today = new Date();
    setAuditDate(today.toISOString().split('T')[0]);
    setAuditTime(today.toTimeString().split(' ')[0].substring(0, 5));
  }, []);

  const toggleSection = (sectionId) => {
    setAuditData(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        expanded: !prev[sectionId].expanded
      }
    }));
  };

  const setStatus = (sectionId, status) => {
    setAuditData(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        status
      }
    }));
  };

  const updateChecklist = (sectionId, itemIndex, checked) => {
    setAuditData(prev => {
      const checkedItems = checked
        ? [...prev[sectionId].checkedItems, itemIndex]
        : prev[sectionId].checkedItems.filter(i => i !== itemIndex);
      
      return {
        ...prev,
        [sectionId]: {
          ...prev[sectionId],
          checkedItems
        }
      };
    });
  };

  const updateNotes = (sectionId, notes) => {
    setAuditData(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        notes
      }
    }));
  };

  const handlePhotoUpload = (sectionId, event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAuditData(prev => ({
          ...prev,
          [sectionId]: {
            ...prev[sectionId],
            photos: [...prev[sectionId].photos, e.target.result]
          }
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (sectionId, photoIndex) => {
    setAuditData(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        photos: prev[sectionId].photos.filter((_, i) => i !== photoIndex)
      }
    }));
  };

  const getProgress = () => {
    const evaluated = Object.values(auditData).filter(s => s.status !== '').length;
    const passed = Object.values(auditData).filter(s => s.status === 'pass').length;
    const total = sections.length;
    const passRate = evaluated > 0 ? Math.round((passed / evaluated) * 100) : 0;
    return { evaluated, passed, total, passRate };
  };

  const progress = getProgress();

  return (
    <div className="App">
      <div className="container">
        <div className="header">
          <h1>🌶️ Chili's Sticker Placement Audit</h1>
          <div className="subtitle">F26 Q2 - 50 Years Edition</div>
        </div>

        <div className="restaurant-info">
          <div className="info-field">
            <label>Restaurant Name/Number</label>
            <input 
              type="text" 
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              placeholder="Enter restaurant name"
            />
          </div>
          <div className="info-field">
            <label>Auditor Name</label>
            <input 
              type="text" 
              value={auditorName}
              onChange={(e) => setAuditorName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="info-field">
            <label>Date</label>
            <input 
              type="date" 
              value={auditDate}
              onChange={(e) => setAuditDate(e.target.value)}
            />
          </div>
          <div className="info-field">
            <label>Time</label>
            <input 
              type="time" 
              value={auditTime}
              onChange={(e) => setAuditTime(e.target.value)}
            />
          </div>
        </div>

        <div className="progress-section">
          <h3>Audit Progress</h3>
          <div className="progress-grid">
            <div className="progress-card">
              <div className="number">{progress.evaluated}</div>
              <div className="label">Evaluated</div>
            </div>
            <div className="progress-card">
              <div className="number">{progress.passed}</div>
              <div className="label">Passed</div>
            </div>
            <div className="progress-card">
              <div className="number">{progress.total}</div>
              <div className="label">Total Sections</div>
            </div>
            <div className="progress-card">
              <div className="number">{progress.passRate}%</div>
              <div className="label">Pass Rate</div>
            </div>
          </div>
        </div>

        <div className="sections-container">
          {sections.map(section => (
            <div key={section.id} className="section-card">
              <div className="section-header" onClick={() => toggleSection(section.id)}>
                <div className="section-title">{section.title}</div>
                <div className="section-status">
                  <span className={`status-indicator status-${auditData[section.id]?.status || 'pending'}`}>
                    {auditData[section.id]?.status === 'pass' ? '✓' : auditData[section.id]?.status === 'fail' ? '✗' : ''}
                  </span>
                </div>
              </div>

              {auditData[section.id]?.expanded && (
                <div className="section-content">
                  <div className="content-grid">
                    <div className="reference-image">
                      <h4>Reference Guide - {section.title}</h4>
                      <img 
                        src={`/images/${section.id}-reference.png`}
                        alt={`${section.title} Reference`}
                        onClick={() => setModalImage(`/images/${section.id}-reference.png`)}
                      />
                      <p>Click to enlarge reference image</p>
                    </div>

                    <div className="audit-controls">
                      <div className="status-buttons">
                        <button 
                          className={`status-btn pass ${auditData[section.id]?.status === 'pass' ? 'active' : ''}`}
                          onClick={() => setStatus(section.id, 'pass')}
                        >
                          ✓ Pass
                        </button>
                        <button 
                          className={`status-btn fail ${auditData[section.id]?.status === 'fail' ? 'active' : ''}`}
                          onClick={() => setStatus(section.id, 'fail')}
                        >
                          ✗ Fail
                        </button>
                      </div>

                      <div className="checklist">
                        {section.items.map((item, index) => (
                          <div key={index} className="checklist-item">
                            <input 
                              type="checkbox"
                              checked={auditData[section.id]?.checkedItems.includes(index)}
                              onChange={(e) => updateChecklist(section.id, index, e.target.checked)}
                            />
                            <label className="checklist-text">
                              {item.text}
                              {item.dsi && <span className="dsi-number">(DSI: {item.dsi})</span>}
                            </label>
                          </div>
                        ))}
                      </div>

                      <div className="notes-section">
                        <label>Notes:</label>
                        <textarea 
                          value={auditData[section.id]?.notes || ''}
                          onChange={(e) => updateNotes(section.id, e.target.value)}
                          placeholder="Add any observations or issues..."
                        />
                      </div>

                      <div className="photo-upload">
                        <input 
                          type="file" 
                          accept="image/*" 
                          multiple
                          onChange={(e) => handlePhotoUpload(section.id, e)}
                          style={{display: 'none'}}
                          id={`photo-input-${section.id}`}
                        />
                        <button 
                          className="photo-btn"
                          onClick={() => document.getElementById(`photo-input-${section.id}`).click()}
                        >
                          📷 Add Photo
                        </button>
                        <div className="photo-grid">
                          {auditData[section.id]?.photos.map((photo, index) => (
                            <div key={index} className="photo-item">
                              <img 
                                src={photo} 
                                alt={`Photo ${index + 1}`}
                                onClick={() => setModalImage(photo)}
                              />
                              <button 
                                className="remove-photo"
                                onClick={() => removePhoto(section.id, index)}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {modalImage && (
        <div className="modal" onClick={() => setModalImage('')}>
          <span className="modal-close">×</span>
          <img src={modalImage} alt="Enlarged view" />
        </div>
      )}
    </div>
  );
}

export default App;
