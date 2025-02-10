import express from 'express';
import { createAnnouncementSchema } from './announcement.schema';
import * as AnnouncementServices from './accnouncement.services';

const router = express.Router();



// mkae a route to get make announcement
router.post('/make-announcement', async (req, res) => {
    try {
      const validationResult = createAnnouncementSchema.safeParse(req.body);
  
      if (!validationResult.success) {
        const zodErrorElement = JSON.parse(validationResult.error.message)[0]
        return res.status(400).json({ data: null, message: zodErrorElement.message });
      }
  
      const validatedData = validationResult.data;
      const newAnnouncement = await AnnouncementServices.createAnnouncement(validatedData);
      if (!newAnnouncement) {
        return res.status(400).json({ data: null, message: "Announcement not created" });
      }
      return res.status(201).json({ message: "announcement created", newAnnouncement });
    } catch (error: any) {
      console.log("🚀 ~ router.post ~ error:", error)
      return res.status(500).json({ message: error.message });
    }
  });
  
  
  // get all announcements
  router.get('/get-announcement', async (req, res) => {
    try {
      const announcement = await AnnouncementServices.getAnnouncement();
      if (!announcement) {
        return res.status(404).json({ data: null, message: "No announcements found" });
      }
      return res.status(200).json({ data: announcement, message: "Announcement fetched successfully" });
    } catch (error: any) {
      console.log("🚀 ~ router.get/get-announcements ~ error:", error);
      return res.status(500).json({ data: null, message: error.message });
    }
  });


  export default router;
  