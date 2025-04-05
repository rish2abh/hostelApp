import { Request, Response } from 'express';
import { Room, RoomStatus } from '../models/room.model';

export const roomController = {
  // Get all rooms with optional filtering
  async getRooms(req: Request, res: Response) {
    try {
      const filter: any = {};
      
      // Apply filters if provided
      if (req.query.type) filter.type = req.query.type;
      if (req.query.status) filter.status = req.query.status;
      if (req.query.floor) filter.floor = req.query.floor;
      
      if (req.query.priceRange) {
        const [min, max] = (req.query.priceRange as string).split('-');
        filter.price = {};
        if (min) filter.price.$gte = parseInt(min);
        if (max) filter.price.$lte = parseInt(max);
      }

      const rooms = await Room.find(filter).sort({ number: 1 });
      res.json(rooms);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching rooms', error });
    }
  },

  // Get room statistics
  async getRoomStats(req: Request, res: Response) {
    try {
      const [totalRooms, availableRooms, occupiedRooms, maintenanceRooms] = await Promise.all([
        Room.countDocuments(),
        Room.countDocuments({ status: RoomStatus.AVAILABLE }),
        Room.countDocuments({ 
          status: { 
            $in: [RoomStatus.PARTIALLY_OCCUPIED, RoomStatus.FULLY_OCCUPIED] 
          } 
        }),
        Room.countDocuments({ status: RoomStatus.MAINTENANCE })
      ]);

      const rooms = await Room.find();
      const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);
      const totalOccupied = rooms.reduce((sum, room) => sum + room.occupied, 0);
      const occupancyRate = (totalOccupied / totalCapacity) * 100;

      res.json({
        totalRooms,
        availableRooms,
        occupiedRooms,
        maintenanceRooms,
        occupancyRate
      });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching room statistics', error });
    }
  },

  // Get a single room by ID
  async getRoom(req: Request, res: Response) {
    try {
      const room = await Room.findById(req.params.id);
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
      res.json(room);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching room', error });
    }
  },

  // Create a new room
  async createRoom(req: Request, res: Response) {
    try {
      const room = new Room(req.body);
      await room.save();
      res.status(201).json(room);
    } catch (error) {
      res.status(400).json({ message: 'Error creating room', error });
    }
  },

  // Update a room
  async updateRoom(req: Request, res: Response) {
    try {
      const room = await Room.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true, runValidators: true }
      );
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
      res.json(room);
    } catch (error) {
      res.status(400).json({ message: 'Error updating room', error });
    }
  },

  // Delete a room
  async deleteRoom(req: Request, res: Response) {
    try {
      const room = await Room.findByIdAndDelete(req.params.id);
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
      res.json({ message: 'Room deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting room', error });
    }
  },

  // Update room status
  async updateRoomStatus(req: Request, res: Response) {
    try {
      const { status } = req.body;
      const room = await Room.findByIdAndUpdate(
        req.params.id,
        { $set: { status } },
        { new: true, runValidators: true }
      );
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }
      res.json(room);
    } catch (error) {
      res.status(400).json({ message: 'Error updating room status', error });
    }
  },

  // Assign a student to a room
  async assignRoom(req: Request, res: Response) {
    try {
      const room = await Room.findById(req.params.id);
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }

      if (room.occupied >= room.capacity) {
        return res.status(400).json({ message: 'Room is already at full capacity' });
      }

      room.occupied += 1;
      await room.save();
      res.json(room);
    } catch (error) {
      res.status(400).json({ message: 'Error assigning room', error });
    }
  },

  // Unassign a student from a room
  async unassignRoom(req: Request, res: Response) {
    try {
      const room = await Room.findById(req.params.id);
      if (!room) {
        return res.status(404).json({ message: 'Room not found' });
      }

      if (room.occupied <= 0) {
        return res.status(400).json({ message: 'Room is already empty' });
      }

      room.occupied -= 1;
      await room.save();
      res.json(room);
    } catch (error) {
      res.status(400).json({ message: 'Error unassigning room', error });
    }
  }
}; 