import React, { useState, useEffect } from 'react';

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
    id: 'to-go',
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
    id: 'bun-toaster',
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
    id: 'ck-hot-hold',
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
    id: 'qa-passout',
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
    id: 'ice-machine',
    title: 'ICE MACHINE & HOH',
    items: [
      { text: 'Ecolab Hand-Washing Sticker installed' },
      { text: 'DO NOT HIT warning label applied' },
      { text: 'HOH Shelf Labels installed', dsi: '005-1461' },
      { text: 'All hand wash sinks have stickers (excluding restrooms)' }
    ]
  }
];

function App() {
  const [auditData, setAuditData] = useState({});
  const [restaurantName, setRestaurantName] = useState('');
  const [auditorName, setAuditorName] = useState('');
  const [auditDate, setAuditDate] = useState('');
  const [auditTime, setAuditTime] = useState('');
  const [modalImage, setModalImage] = useState('');

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

  if (Object.keys(auditData).length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  const progress = getProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-purple-800 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-chilis-red text-white p-8 text-center">
          <h1 className="text-4xl font-bold mb-2">🌶️ Chili's Sticker Placement Audit</h1>
          <div className="text-xl opacity-90">F26 Q2 - 50 Years Edition</div>
        </div>

        {/* Restaurant Info */}
        <div className="bg-gray-50 p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Restaurant Name/Number</label>
            <input
              type="text"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              placeholder="Enter restaurant name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-chilis-red"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Auditor Name</label>
            <input
              type="text"
              value={auditorName}
              onChange={(e) => setAuditorName(e.target.value)}
              placeholder="Your name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-chilis-red"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Date</label>
            <input
              type="date"
              value={auditDate}
              onChange={(e) => setAuditDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-chilis-red"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Time</label>
            <input
              type="time"
              value={auditTime}
              onChange={(e) => setAuditTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-chilis-red"
            />
          </div>
        </div>

        {/* Progress Section */}
        <div className="bg-blue-50 p-6 m-6 rounded-xl">
          <h3 className="text-xl font-bold mb-4">Audit Progress</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-3xl font-bold text-chilis-red">{progress.evaluated}</div>
              <div className="text-sm text-gray-600 mt-1">Evaluated</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-3xl font-bold text-chilis-red">{progress.passed}</div>
              <div className="text-sm text-gray-600 mt-1">Passed</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-3xl font-bold text-chilis-red">{progress.total}</div>
              <div className="text-sm text-gray-600 mt-1">Total Sections</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-3xl font-bold text-chilis-red">{progress.passRate}%</div>
              <div className="text-sm text-gray-600 mt-1">Pass Rate</div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="p-6 space-y-4">
          {sections.map(section => (
            <div key={section.id} className="border border-gray-200 rounded-xl overflow-hidden shadow-md">
              {/* Section Header */}
              <div
                className="bg-gray-800 text-white p-4 cursor-pointer hover:bg-gray-700 transition-colors flex justify-between items-center"
                onClick={() => toggleSection(section.id)}
              >
                <div className="text-lg font-bold">{section.title}</div>
                <div className="flex items-center gap-2">
                  {auditData[section.id]?.status === 'pass' && (
                    <span className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">✓</span>
                  )}
                  {auditData[section.id]?.status === 'fail' && (
                    <span className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">✗</span>
                  )}
                  {!auditData[section.id]?.status && (
                    <span className="bg-gray-400 w-8 h-8 rounded-full"></span>
                  )}
                </div>
              </div>

              {/* Section Content */}
              {auditData[section.id]?.expanded && (
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Reference Image */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-bold mb-3">Reference Guide - {section.title}</h4>
                      <img
                        src={`/images/${section.id}-reference.png`}
                        alt={`${section.title} Reference Guide`}
                        onClick={() => setModalImage(`/images/${section.id}-reference.png`)}
                        className="w-full rounded-lg cursor-zoom-in hover:opacity-90 transition-opacity"
                      />
                      <p className="text-sm text-gray-600 mt-2">Click to enlarge reference guide</p>
                    </div>

                    {/* Audit Controls */}
                    <div>
                      {/* Status Buttons */}
                      <div className="flex gap-3 mb-4">
                        <button
                          className={`flex-1 py-3 px-4 rounded-lg font-bold border-2 transition-all ${
                            auditData[section.id]?.status === 'pass'
                              ? 'bg-green-500 text-white border-green-500'
                              : 'bg-white text-green-500 border-green-500 hover:bg-green-50'
                          }`}
                          onClick={() => setStatus(section.id, 'pass')}
                        >
                          ✓ Pass
                        </button>
                        <button
                          className={`flex-1 py-3 px-4 rounded-lg font-bold border-2 transition-all ${
                            auditData[section.id]?.status === 'fail'
                              ? 'bg-red-500 text-white border-red-500'
                              : 'bg-white text-red-500 border-red-500 hover:bg-red-50'
                          }`}
                          onClick={() => setStatus(section.id, 'fail')}
                        >
                          ✗ Fail
                        </button>
                      </div>

                      {/* Checklist */}
                      <div className="space-y-2 mb-4">
                        {section.items.map((item, index) => (
                          <div key={index} className="flex items-start bg-gray-50 p-3 rounded-lg">
                            <input
                              type="checkbox"
                              checked={auditData[section.id]?.checkedItems.includes(index)}
                              onChange={(e) => updateChecklist(section.id, index, e.target.checked)}
                              className="mt-1 mr-3 w-4 h-4 text-chilis-red focus:ring-chilis-red"
                            />
                            <label className="flex-1 text-sm">
                              {item.text}
                              {item.dsi && <span className="text-gray-500 ml-2 text-xs">(DSI: {item.dsi})</span>}
                            </label>
                          </div>
                        ))}
                      </div>

                      {/* Notes */}
                      <div className="mb-4">
                        <label className="block font-semibold mb-2">Notes:</label>
                        <textarea
                          value={auditData[section.id]?.notes || ''}
                          onChange={(e) => updateNotes(section.id, e.target.value)}
                          placeholder="Add any observations or issues..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-chilis-red resize-y min-h-20"
                        />
                      </div>

                      {/* Photo Upload */}
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => handlePhotoUpload(section.id, e)}
                          className="hidden"
                          id={`photo-input-${section.id}`}
                        />
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors mb-3"
                          onClick={() => document.getElementById(`photo-input-${section.id}`).click()}
                        >
                          📷 Add Photo
                        </button>
                        <div className="grid grid-cols-3 gap-2">
                          {auditData[section.id]?.photos.map((photo, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={photo}
                                alt={`Upload ${index + 1}`}
                                onClick={() => setModalImage(photo)}
                                className="w-full h-24 object-cover rounded-lg cursor-zoom-in"
                              />
                              <button
                                className="absolute -top-2 -right-2 bg-red-500 text-white w-6 h-6 rounded-full hover:bg-red-600 text-sm"
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

      {/* Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setModalImage('')}
        >
          <span className="absolute top-8 right-12 text-white text-5xl cursor-pointer hover:text-gray-300">×</span>
          <img src={modalImage} alt="Enlarged view" className="max-w-full max-h-full rounded-xl" />
        </div>
      )}
    </div>
  );
}

export default App;
