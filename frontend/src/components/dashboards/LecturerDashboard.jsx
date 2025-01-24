import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layout/DashboardLayout';
import HallTabs from '../halls/HallTabs';
import api from '../../utils/axios';
import { IoClose, IoLocationOutline, IoCalendarOutline, IoTrashOutline } from 'react-icons/io5';

const RequestModal = ({ hall, onClose, onSubmit }) => {
  const [examTitle, setExamTitle] = useState('');
  const [examDate, setExamDate] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(examTitle, examDate);
    
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-[28rem] shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Request Hall: {hall.name}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <IoClose />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="examTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Exam Title
            </label>
            <input
              id="examTitle"
              type="text"
              placeholder="Enter the title of your exam"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              value={examTitle}
              onChange={(e) => setExamTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="examDate" className="block text-sm font-medium text-gray-700 mb-1">
              Exam Date
            </label>
            <input
              id="examDate"
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const LecturerDashboard = () => {
  const [selectedHall, setSelectedHall] = useState(null);
  const [requests, setRequests] = useState([]);
  const [allocatedHalls, setAllocatedHalls] = useState([]);

  useEffect(() => {
    fetchRequests();
    fetchAllocatedHalls();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/halls/lecturer/requests');
      setRequests(data.requests);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const fetchAllocatedHalls = async () => {
    try {
      const { data } = await api.get('/halls/lecturer');
      setAllocatedHalls(data.halls);
    } catch (error) {
      console.error('Error fetching allocated halls:', error);
    }
  };

  const handleRequestHall = (hall) => {
    setSelectedHall(hall);
  };

  const handleRequestSubmit = async (examTitle, examDate) => {
    try {
      await api.post(`/halls/lecturer/${selectedHall._id}/request`, {
        examTitle,
        examDate,
      });
      setSelectedHall(null);
      fetchRequests();
    } catch (error) {
      console.error('Error submitting request:', error);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    try {
      await api.delete(`/halls/lecturer/requests/${requestId}`);
      fetchRequests();
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Lecturer Dashboard</h1>
        
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <span>Hall Requests</span>
            <span className="ml-3 px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
              {requests.length} Active
            </span>
          </h2>
          {requests.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500 text-lg">No pending hall requests</p>
              <p className="text-gray-400 mt-2">Your hall requests will appear here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map((request) => (
                <div key={request._id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900">{request.hall.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-gray-600 flex items-center">
                      <IoCalendarOutline className="text-sm mr-2" />
                      {request.examTitle} ({request.examDate?.split('T')[0]})
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteRequest(request._id)}
                    className="mt-4 w-full px-4 py-2 text-red-600 hover:text-white hover:bg-red-600 rounded-lg border border-red-600 transition-colors duration-200 flex items-center justify-center"
                  >
                    <IoTrashOutline className="text-sm mr-2" />
                    Cancel Request
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <span>Allocated Halls</span>
            <span className="ml-3 px-3 py-1 text-sm bg-green-100 text-green-800 rounded-full">
              {allocatedHalls.length} Active
            </span>
          </h2>
          {allocatedHalls.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <p className="text-gray-500 text-lg">No halls allocated</p>
              <p className="text-gray-400 mt-2">Halls allocated to you will appear here</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allocatedHalls.map((hall) => (
                <div key={hall._id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900">{hall.name}</h3>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      Allocated
                    </span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <p className="text-gray-600 flex items-center">
                      <IoLocationOutline className="text-sm mr-2" />
                      {hall.location}
                    </p>
                    <p className="text-gray-600 flex items-center">
                      <IoCalendarOutline className="text-sm mr-2" />
                      {hall.allocatedTo.examTitle}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <HallTabs userRole="lecturer" onRequestHall={handleRequestHall} />

        {selectedHall && (
          <RequestModal
            hall={selectedHall}
            onClose={() => setSelectedHall(null)}
            onSubmit={handleRequestSubmit}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default LecturerDashboard;