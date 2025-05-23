import User from "../models/user.model";
import { Request, Response } from "express";
import { asyncWrapper } from "../utils/asyncWrapper";
import { handleClientError } from "../utils/errorHandler";
import cloudinary from "../config/cloudinary";
import { UploadApiResponse } from "cloudinary";


export const fetchAllUsers = asyncWrapper(async (req: Request, res: Response) => {

    const loggedInUserId = req.user?._id!;
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    res.status(200).send({ users });

}, "fetchAllUsers");

export const searchUsers = asyncWrapper(async (req: Request, res: Response) => {
    const { username } = req.query;
    if (!username || typeof username !== 'string') {
        handleClientError(res, 400, "Invalid or missing username query parameter.")
        return
    }
    const users = await User.find({ username: { $regex: username, $options: "i" } }).select("-password")

    res.status(200).send({ success: true, users });
}, "searchUsers");

export const updateProfile = asyncWrapper(async (req: Request, res: Response) => {
    const { bio, username, dob, link } = req.body;
    console.log(dob)
    const userId = req.user?._id!;
    interface ProfileUpdates {
        username?: string;
        bio?: string;
        picture?: string;
        picturePublicId?: string;
        dob?: Date;
        links?: Array<{ url: string; title?: string }>;
    }

    const updates: ProfileUpdates = {};
    if (username) {
        updates.username = username;
    }
    if (bio) {
        updates.bio = bio
    }
    if (dob) {
        updates.dob = new Date(dob);
    }
    if (link) {
        const parsedLink = JSON.parse(link);
        console.log(parsedLink);
        if (!parsedLink.url) {
            handleClientError(res, 400, "URL is required");
            return
        }
        if (!parsedLink.title) {
            handleClientError(res, 400, "Link title is required");
            return
        }
        const user = await User.findById(userId);
        if (!user) {
            return
        }
        updates.links = user.links ? [...user.links] : [];
        updates.links.push(parsedLink);

    }
    if (req.file) {
        console.log("Got Picture")
        const existingUser = await User.findById(userId);
        if (existingUser?.picturePublicId) {
            await cloudinary.uploader.destroy(existingUser.picturePublicId);
        }
        const result = await new Promise<UploadApiResponse>((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream({ folder: "user-pictures" }, (error, result) => {
                if (error) return reject(error)
                if (!result) return reject(new Error("result is undefined"));
                resolve(result)
            })
            uploadStream.end(req.file?.buffer);
        })
        updates.picture = result.secure_url
        updates.picturePublicId = result.public_id;
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
            $set: updates
        },
        {
            new: true
        }
    ).select("-password -picturePublicId");;


    // console.log(bio, username)
    console.log(updatedUser);
    res.status(200).send({ message: "Profile updated successfully", user: updatedUser })
}, "updateProfile")


export const blockUser = asyncWrapper(async (req: Request, res: Response) => {
    const { blockedUserId } = req.body;
    const user = req.user!;
    console.log("Blocked user id ", blockedUserId)
    const userToBlock = await User.findById(blockedUserId);
    if (!userToBlock) {
        res.status(404).json({ message: "User does not exist" });
        return;
    }

    const isAlreadyBlocked = user?.blockedUsers.some(b => b.user.equals(blockedUserId));
    if (isAlreadyBlocked) {
        res.status(400).json({ message: "User already blocked" });
        return;
    }
    await Promise.all([
        User.findByIdAndUpdate(user._id, {
            $push: {
                blockedUsers: { user: blockedUserId }
            },
            $pull: { friends: blockedUserId }
        }),
        User.findByIdAndUpdate(blockedUserId, {
            $push: {
                blockedBy: { user: user._id }
            },
            $pull: { friends: user._id }
        })
    ]);
    res.status(200).json({ message: "User blocked successfully" })

}, "blockUser")


export const unblockUser = asyncWrapper(async (req: Request, res: Response) => {
    const userId = req.user?._id!;
    const { blockedUserId } = req.body;
    await Promise.all([
        User.findByIdAndUpdate(userId, {
            $pull: {
                blockedUsers: { user: blockedUserId }
            }
        }),
        User.findByIdAndUpdate(blockedUserId, {
            $pull: {
                blockedBy: { user: userId }
            }
        })
    ]);
    res.status(200).json({ message: "User unblocked successfully" });
}, "unblockUser")


export const deleteLink = asyncWrapper(async (req: Request, res: Response) => {

}, "deleteLink")