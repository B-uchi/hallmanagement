const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const hallController = require('../controllers/hallController');
const { protect, restrictTo } = require('../middleware/auth');

// Auth routes
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Hall routes
// Admin only routes
router.use('/halls/admin', protect, restrictTo('admin'));
router.post('/halls/admin', hallController.createHall);
router.patch('/halls/admin/:id', hallController.updateHall);
router.delete('/halls/admin/:id', hallController.deleteHall);
router.patch('/halls/admin/:requestId/allocate', hallController.allocateHall);
router.patch('/halls/admin/:id/deallocate', hallController.removeAllocation);
router.get('/halls/admin/requests', hallController.getAllRequests);

// Lecturer routes
router.use('/halls/lecturer', protect, restrictTo('lecturer'));
router.post('/halls/lecturer/:hallId/request', hallController.requestHall);
router.get('/halls/lecturer/requests', hallController.getLecturerRequests);
router.delete('/halls/lecturer/requests/:id', hallController.deleteRequest);
router.get("/halls/lecturer", hallController.getLecturerHalls);


// Common routes (accessible to all authenticated users)
router.get('/halls', protect, hallController.getHalls);

module.exports = router;