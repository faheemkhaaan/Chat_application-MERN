import { Types } from "mongoose";
import cloudinary from "../config/cloudinary";
import Group from "../models/group.model";
import User from "../models/user.model";
import { io } from "../socket/socket";
import { asyncWrapper } from "../utils/asyncWrapper";
import { Request, Response } from "express";
import { handleClientError } from "../utils/errorHandler";


export const createGroup = asyncWrapper(async (req: Request, res: Response) => {
    const { name, description, members } = req.body;
    const userId = (req as any).user._id;
    const membersArray = typeof members === 'string' ? JSON.parse(members) : members;
    let avatarUrl: string = '';
    console.log(cloudinary.config())
    if (req.file) {
        try {
            // Using Promise-based upload instead of callback style

            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "group_avatars" },
                    (error, result) => {
                        if (error) return reject(error);
                        if (!result) return reject(new Error("Upload result is undefined"));
                        resolve(result);
                    }
                );
                uploadStream.end(req.file?.buffer);
            });

            avatarUrl = (result as any).secure_url;
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            throw new Error("Failed to upload group avatar");
        }
    }

    const newGroup = new Group({
        name,
        description,
        creator: userId,
        avatar: avatarUrl,
        admins: [userId],
        members: [userId, ...membersArray]
    });

    const savedGroup = await newGroup.save();

    const populatedGroup = await savedGroup.populate([
        { path: "creator", select: "-password -socketId -picturePublicId" },
        { path: "admins", select: "-password -socketId -picturePublicId" },
        { path: "members", select: "-password -socketId -picturePublicId" },
        { path: "messages" },
    ])
    await User.findByIdAndUpdate(
        userId,
        { $push: { adminGroups: savedGroup._id } },
    );

    io.emit("groupCreated");

    res.status(201).send({ group: populatedGroup });
}, "createGroup");

export const uploadGroupImage = asyncWrapper(async (req: Request, res: Response) => {
    let avatarUrl = ""
    if (req.file) {
        try {
            // Using Promise-based upload instead of callback style

            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "group_avatars" },
                    (error, result) => {
                        if (error) return reject(error);
                        if (!result) return reject(new Error("Upload result is undefined"));
                        resolve(result);
                    }
                );
                uploadStream.end(req.file?.buffer);
            });

            avatarUrl = (result as any).secure_url;
        } catch (error) {
            console.error("Cloudinary upload error:", error);
            throw new Error("Failed to upload group avatar");
        }
    }
    res.status(200).json({ avatarUrl })
}, "uploadGroupImage");


export const deleteGroup = asyncWrapper(async (req: Request, res: Response) => {
    const { groupId } = req.params;
    const userId = req.user?.id;
    if (!groupId) {
        res.status(400).json({ message: "Group id is required" });
        return;
    }
    const foundGroup = await Group.findById(groupId);
    if (!foundGroup) {
        res.status(404).json({ message: "Group does not exist with the given id" });
        return;
    }
    if (!foundGroup?.admins.includes(userId)) {
        res.status(400).json({ message: "You are not authroized to delete this group" })
        return;
    }
    await Group.findByIdAndDelete(groupId);
    io.emit("groupDeleted");
    res.status(200).json({ message: "Group deleted successfully" })
}, "deleteGroup")

export const requestToJoinGroup = asyncWrapper(async (req: Request, res: Response) => {
    const { groupId } = req.params;
    const userId = req.user?.id;
    const existingGroup = await Group.findById(groupId);
    if (!existingGroup) {
        res.status(404).send({ message: "Group with id does not exist" });
        return;
    }
    if (existingGroup.admins.includes(userId)) {
        res.status(400).send({ message: 'Your are already the admin' });
        return;
    }
    if (existingGroup.members.includes(userId)) {
        res.status(400).send({ message: "You are already a member of this group" });
        return;
    }
    if (existingGroup.pendingRequests.includes(userId)) {
        handleClientError(res, 404, "Your request is pending please wait for admin aproval");
        return;
    }
    existingGroup.pendingRequests.push(userId);
    await existingGroup.save();
    io.emit("groupUpdated")
    res.status(200).send({ message: "Your request to join the group is sent successfully, please wait for admin confirmation." });
}, "requestToJoinGroup")

export const leaveGroup = asyncWrapper(async (req: Request, res: Response) => {
    const { groupId } = req.params;
    const userId = req.user?.id;
    const existingGroup = await Group.findById(groupId);
    if (!existingGroup) {
        handleClientError(res, 400, "Group does not exist");
        return
    }
    if (!existingGroup.members.includes(userId)) {
        handleClientError(res, 400, "You are not a memeber of this group");
        return;
    };
    await Group.findByIdAndUpdate(groupId, {
        $pull: {
            members: userId
        }
    });
    io.emit("leftGroup");
    res.status(200).json({ message: "you left the group successfully" });
}, "leaveGroup");
export const approveRequests = asyncWrapper(async (req: Request, res: Response) => {
    const { groupId, userId } = req.params;
    const { approve } = req.body;
    const user = req.user;
    const existingGroup = await Group.findById(groupId);
    if (!existingGroup) {
        handleClientError(res, 404, "Group does not exist");
        return;
    };
    if (!existingGroup.admins.includes(user?.id)) {
        handleClientError(res, 400, "You are not authorized to approve requests");
        return;
    }
    if (!existingGroup.pendingRequests.includes(new Types.ObjectId(userId))) {
        handleClientError(res, 400, "User does not exist in pending requests");
        return;
    }
    if (!approve) {
        await Group.findByIdAndUpdate(groupId, {
            $pull: {
                pendingRequests: userId
            }
        })
        io.emit("requestApproved");

        handleClientError(res, 400, "Your request is rejected");
        return;
    }
    await Group.findByIdAndUpdate(groupId, {
        $pull: {
            pendingRequests: userId
        },
        $push: {
            members: userId
        }
    });
    io.emit("requestApproved");
    res.status(200).json({ message: "Requests approved" });
}, "approveRequests");

export const groupPreviews = asyncWrapper(async (req: Request, res: Response) => {
    const { groupId } = req.body;
    if (!groupId) {
        handleClientError(res, 400, "Group Id is required");
        return;
    }
    const foundGroup = await Group.findById(groupId);
    res.status(200).json(foundGroup)

}, "groupPreviews");


export const searchGroups = asyncWrapper(async (req: Request, res: Response) => {
    const { name } = req.query;
    if (!name) {
        handleClientError(res, 400, "Group name is required");
        return;
    }
    const groups = await Group.find({ name: { $regex: name, $options: "i" } }).populate({
        path: "messages", populate: { path: "senderId", select: "_id picture username" },

    });
    res.status(200).json({ success: true, groups });
}, "searchGroups")