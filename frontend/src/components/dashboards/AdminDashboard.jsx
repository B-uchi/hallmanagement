import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import HallTabs from '../halls/HallTabs';
import api from '../../utils/axios';
import { IoPersonOutline, IoCalendarOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';
import { toast } from 'sonner';

const HallForm = ({ hall, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: hall?.name || '',
    location: hall?.location || '',
    capacity: hall?.capacity || '',
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Hall Name
        </label>
        <input
          id="name"
          type="text"
          placeholder="Enter hall name"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          id="location"
          type="text"
          placeholder="Enter hall location"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
        />
      </div>
      <div>
        <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
          Capacity
        </label>
        <input
          id="capacity"
          type="number"
          placeholder="Enter hall capacity"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          value={formData.capacity}
          onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
          required
        />
      </div>
      <div className="flex space-x-3">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          {hall ? 'Update Hall' : 'Create Hall'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const AdminDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingHall, setEditingHall] = useState(null);
  const [requests, setRequests] = useState([]);
  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/halls/admin/requests');
      setRequests(data.requests);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast.error('Failed to fetch hall requests. Please try again.');
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingHall) {
        await api.patch(`/halls/admin/${editingHall._id}`, formData);
      } else {
        await api.post('/halls/admin', formData);
      }
      setShowForm(false);
      setRerender(!rerender);
      setEditingHall(null);
    } catch (error) {
      console.error('Error saving hall:', error);
      toast.error(editingHall ? 
        'Failed to update hall. Please try again.' :
        'Failed to create hall. Please try again.'
      );
    }
  };

  const handleAllocate = async (requestId) => {
    try {
      await api.patch(`/halls/admin/${requestId}/allocate`);
      fetchRequests();
      setRerender(!rerender);
    } catch (error) {
      console.error('Error allocating hall:', error);
      toast.error('Failed to allocate hall. Please try again.');
    }
  };

  const handleEditHall = (hall) => {
    setEditingHall(hall);
    setShowForm(true);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Manage Halls</h2>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 flex items-center"
            >
              Add New Hall
            </button>
          </div>

          {showForm && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                {editingHall ? 'Edit Hall' : 'Create New Hall'}
              </h3>
              <HallForm
                hall={editingHall}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingHall(null);
                }}
              />
            </div>
          )}
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <span>Hall Requests</span>
            <span className="ml-3 px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
              {requests.length} Pending
            </span>
          </h2>
          
          {requests.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500 text-lg">No pending hall requests</p>
              <p className="text-gray-400 mt-2">New requests will appear here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map((request) => (
                <div key={request._id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{request.hall.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      request.status === 'approved' 
                        ? 'bg-green-100 text-green-800'
                        : request.status === 'rejected'
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                  <div className="space-y-2 mb-4">
                    <p className="text-gray-600 flex items-center">
                      <IoPersonOutline className="text-sm mr-2" />
                      {request.lecturer.fullName}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <IoCalendarOutline className="text-sm mr-2" />
                      {request.examTitle} ({request.examDate?.split('T')[0]})
                    </p>
                  </div>
                  <button
                    onClick={() => handleAllocate(request._id)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                  >
                    <IoCheckmarkCircleOutline className="text-sm mr-2" />
                    Approve & Allocate
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <HallTabs 
          userRole="admin" 
          rerender={rerender} 
          onEditHall={handleEditHall}
        />
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;