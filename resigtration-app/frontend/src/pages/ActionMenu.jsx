import React, { useState } from "react";

const ActionMenu = ({ user, onEdit, onDelete, onUpdateEmail }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button 
        onClick={() => setOpen(!open)} 
        className="p-2 rounded hover:bg-gray-200"
      >
        ⋮
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-40 bg-yellow-200 border rounded-lg shadow-lg ">
          <button 
            onClick={() => { setOpen(false); onEdit(user); }} 
            className="block w-full text-center px-4 py-1 hover:bg-gray-100"
          >
            Edit User
          </button>
          <button 
            onClick={() => { setOpen(false); onUpdateEmail(user); }} 
            className="block w-full text-center px-4 py-2 hover:bg-gray-100"
          >
            Update Email
          </button>
          <button 
            onClick={() => { setOpen(false); onDelete(user.id); }} 
            className="block w-full text-center px-4 py-2 text-red-600 hover:bg-gray-100"
          >
            Delete User
          </button>
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
