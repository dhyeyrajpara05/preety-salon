import React, { useState, useRef, useEffect } from 'react';

const MultiSelect = ({ options, selectedValues, onChange, placeholder, loading }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (value) => {
        const newSelection = selectedValues.includes(value)
            ? selectedValues.filter(v => v !== value)
            : [...selectedValues, value];
        onChange(newSelection);
    };

    const displayText = selectedValues.length > 0 
        ? `${selectedValues.length} Services Selected` 
        : (loading ? 'Loading Signature Rituals...' : placeholder);

    return (
        <div className="multi-select-container" ref={dropdownRef} style={{ position: 'relative', width: '100%' }}>
            <div 
                className="multi-select-trigger" 
                onClick={() => !loading && setIsOpen(!isOpen)}
                style={{
                    padding: '15px 20px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(229, 227, 66, 0.2)',
                    borderRadius: '4px',
                    color: selectedValues.length > 0 ? '#e5e342' : '#888',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '15px',
                    transition: 'all 0.3s ease'
                }}
            >
                <span>{displayText}</span>
                <svg 
                    width="12" height="12" viewBox="0 0 12 12" fill="none" 
                    style={{ 
                        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease',
                        stroke: '#e5e342'
                    }}
                >
                    <path d="M2.5 4.5L6 8L9.5 4.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </div>

            {isOpen && (
                <div 
                    className="multi-select-dropdown"
                    style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        right: 0,
                        zIndex: 1000,
                        marginTop: '5px',
                        backgroundColor: '#08090b',
                        border: '1px solid rgba(229, 227, 66, 0.3)',
                        borderRadius: '4px',
                        maxHeight: '400px',
                        overflowY: 'auto',
                        boxShadow: '0 10px 40px rgba(0,0,0,0.8)',
                        backdropFilter: 'blur(20px)',
                        padding: '10px 0'
                    }}
                >
                    {options.map((category) => (
                        <div key={category.sid || category.title} className="dropdown-category">
                            <div style={{
                                padding: '10px 20px',
                                fontSize: '12px',
                                fontWeight: '700',
                                color: '#e5e342',
                                textTransform: 'uppercase',
                                letterSpacing: '1px',
                                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                marginBottom: '5px',
                                display: 'flex',
                                justifyContent: 'space-between'
                            }}>
                                <span>{category.title}</span>
                                <span style={{ opacity: 0.6, fontSize: '10px' }}>{category.gender === 'men' ? 'MEN' : 'WOMEN'}</span>
                            </div>
                            {category.items.map((item, idx) => (
                                <div 
                                    key={idx}
                                    onClick={() => toggleOption(item.name)}
                                    style={{
                                        padding: '10px 20px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s ease',
                                        backgroundColor: selectedValues.includes(item.name) ? 'rgba(229, 227, 66, 0.1)' : 'transparent'
                                    }}
                                    className="dropdown-item"
                                >
                                    <div style={{
                                        width: '18px',
                                        height: '18px',
                                        border: `1px solid ${selectedValues.includes(item.name) ? '#e5e342' : 'rgba(255,255,255,0.2)'}`,
                                        borderRadius: '3px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: selectedValues.includes(item.name) ? '#e5e342' : 'transparent',
                                        transition: 'all 0.2s ease'
                                    }}>
                                        {selectedValues.includes(item.name) && (
                                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M2 5L4 7L8 3" stroke="#08090b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        )}
                                    </div>
                                    <span style={{ 
                                        color: selectedValues.includes(item.name) ? '#ffffff' : '#ccc',
                                        fontSize: '14px'
                                    }}>
                                        {item.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}
                    <div className="dropdown-footer" style={{ 
                        padding: '10px 20px', 
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                        marginTop: '5px',
                        display: 'flex',
                        justifyContent: 'flex-end'
                    }}>
                        <button 
                            onClick={() => setIsOpen(false)}
                            style={{
                                padding: '5px 15px',
                                backgroundColor: '#e5e342',
                                color: '#08090b',
                                border: 'none',
                                borderRadius: '3px',
                                fontSize: '12px',
                                fontWeight: '700',
                                cursor: 'pointer'
                            }}
                        >
                            DONE
                        </button>
                    </div>
                </div>
            )}
            <style jsx>{`
                .multi-select-dropdown::-webkit-scrollbar {
                    width: 5px;
                }
                .multi-select-dropdown::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.02);
                }
                .multi-select-dropdown::-webkit-scrollbar-thumb {
                    background: rgba(229, 227, 66, 0.3);
                    border-radius: 10px;
                }
                .dropdown-item:hover {
                    background-color: rgba(255, 255, 255, 0.05) !important;
                }
            `}</style>
        </div>
    );
};

export default MultiSelect;
