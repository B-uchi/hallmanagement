import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';
import { IoLocationOutline, IoAddCircleOutline, IoPerson, IoPersonOutline, IoBookOutline, IoPencil, IoTrash, IoClose } from "react-icons/io5";
import { MdEventNote } from "react-icons/md";
import { toast } from 'sonner';

const HallTabs = ({ userRole, onRequestHall, rerender, onEditHall }) => {
  const [activeTab, setActiveTab] = useState('all');
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHalls();
  }, [activeTab, rerender]);

  const fetchHalls = async () => {
    try {
      setLoading(true);
      const status = activeTab === 'all' ? '' : activeTab;
      const { data } = await api.get(`/halls?status=${status}`);
      setHalls(data?.halls || []);
    } catch (error) {
      console.error('Error fetching halls:', error);
      toast.error('Failed to fetch halls');
      setHalls([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (hallId) => {
    if (window.confirm('Are you sure you want to delete this hall?')) {
      try {
        await api.delete(`/halls/admin/${hallId}`);
        toast.success('Hall deleted successfully');
        fetchHalls();
      } catch (error) {
        console.error('Error deleting hall:', error);
        toast.error('Failed to delete hall');
      }
    }
  };

  const handleDeallocate = async (hallId) => {
    if (window.confirm('Are you sure you want to deallocate this hall?')) {
      try {
        await api.patch(`/halls/admin/${hallId}/deallocate`);
        toast.success('Hall deallocated successfully');
        fetchHalls();
      } catch (error) {
        console.error('Error deallocating hall:', error);
        toast.error('Failed to deallocate hall');
      }
    }
  };

  const renderEmptyState = () => (
    <div className="bg-gray-50 rounded-lg p-8 text-center">
      <p className="text-gray-500 text-lg">No halls found</p>
      <p className="text-gray-400 mt-2">
        {activeTab === 'all' 
          ? 'No halls have been added yet'
          : `No ${activeTab} halls at the moment`}
      </p>
    </div>
  );

  return (
    <div>
      <div className="mb-8 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {['all', 'available', 'allocated'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                ${activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize
              `}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      ) : !halls || halls.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {halls.map((hall) => (
            <div 
              key={hall._id} 
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{hall.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  hall.status === 'available' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {hall.status}
                </span>
              </div>
              
              <div className="space-y-2">
                <p className="text-gray-600 flex items-center">
                  <IoLocationOutline className="text-lg mr-2" />
                  {hall.location}
                </p>
                
                {hall.allocatedTo && (
                  <>
                    <p className="text-gray-600 flex items-center">
                      <IoPersonOutline className="text-lg mr-2" />
                      {hall.allocatedTo.lecturer?.fullName}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <IoBookOutline className="text-lg mr-2" />
                      {hall.allocatedTo.examTitle}
                    </p>
                  </>
                )}
              </div>

              {userRole === 'admin' && (
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => onEditHall(hall)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors duration-200"
                    title="Edit Hall"
                  >
                    <IoPencil className="text-xl" />
                  </button>
                  <button
                    onClick={() => handleDelete(hall._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors duration-200"
                    title="Delete Hall"
                  >
                    <IoTrash className="text-xl" />
                  </button>
                  {hall.status === 'allocated' && (
                    <button
                      onClick={() => handleDeallocate(hall._id)}
                      className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-full transition-colors duration-200"
                      title="Deallocate Hall"
                    >
                      <IoClose className="text-xl" />
                    </button>
                  )}
                </div>
              )}

              {userRole === 'lecturer' && hall.status === 'available' && (
                <button
                  onClick={() => onRequestHall(hall)}
                  className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                >
                  <IoAddCircleOutline className="text-lg mr-2" />
                  Request Hall 
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HallTabs;