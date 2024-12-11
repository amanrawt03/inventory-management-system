import React, { useState } from 'react';

const InventoryDetailsModal = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => setIsOpen(!isOpen);

  return (
    <div>
      <button onClick={toggleModal} className="btn btn-outline btn-sm">
        View Inventory Details
      </button>
      {isOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Inventory Details for {item}</h3>
            {/* Display inventory details here */}
            <p>Inventory details...</p>
            <div className="modal-action">
              <button className="btn" onClick={toggleModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryDetailsModal;
