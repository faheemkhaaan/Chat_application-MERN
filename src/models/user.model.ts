import { Schema, CallbackError, model, Model, Types, SchemaDefinition, SchemaDefinitionType } from "mongoose";
import bcrypt from 'bcrypt'
import { IUser } from "../types/model.types";
export interface IUserModel extends Model<IUser> {
    // Static methods would go here
    // Example:
    // findByEmail(email: string): Promise<IUser | null>;
}
const userSchemaDefiniations: SchemaDefinition<SchemaDefinitionType<IUser>> = {
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email"],
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    picture: {
        type: String,
        default: ""
    },
    picturePublicId: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        default: "",
        maxlength: 160
    },
    status: {
        type: String,
        enum: ["online", "offline", "away", "busy"],
        default: "offline"
    },
    lastSeen: {
        type: Date,
        default: Date.now
    },
    phone: {
        type: String,
        default: ""
    },
    dob: {
        type: Date,
        default: ""
    },
    friends: [{
        type: Types.ObjectId,
        ref: "User"
    }],
    groups: [{
        type: Types.ObjectId,
        ref: "Group"
    }],
    adminGroups: [{
        type: Types.ObjectId,
        ref: "Group"
    }],
    socketId: {
        type: String,
        default: ""
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    notificationsEnabled: {
        type: Boolean,
        default: true
    },
    pushToken: {
        type: String,
        default: ""
    },
    settings: {
        theme: {
            type: String,
            enum: ["light", "dark"],
            default: "light"
        },
        language: {
            type: String,
            default: "en"
        }
    },
    blockedUsers: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        blockAt: {
            type: Date,
            default: Date.now
        }
    }],
    blockedBy: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        blockedAt: {
            type: Date,
            default: Date.now
        }
    }],
    emailVerificationToken: {
        type: String,
        required: false,
    },
    emailVerificationExpires: {
        type: Date,
        required: false
    },
    links: [
        {
            url: {
                type: String,
                required: true,
                validate: {
                    validator: function (v: string) {
                        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(v);
                    },
                    message: (props: any) => `${props.value} is not a valid URL!`
                }
            },
            title: {
                type: String,
                default: "",
                maxLength: 50,
            },
            icon: {
                type: String,
                default: ""
            }
        }
    ],
    passwordResetToken: String,
    passwordRestTokenExpires: Date
}
const userSchema = new Schema<IUser, IUserModel>(userSchemaDefiniations, { timestamps: true });

userSchema.methods.comparePassword = async function (plainPassword: string) {
    try {
        return await bcrypt.compare(plainPassword, this.password);
    } catch (error) {
        throw new Error("Error comparing password")
    }

}

userSchema.pre<IUser>("save", async function hassPassword(next: (err?: CallbackError) => void) {
    const user = this;
    if (!user.isModified("password")) return next()
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(user.password, salt);
        this.password = hashPassword
    } catch (error) {
        next(error as CallbackError)
    }
})

const User: Model<IUser> = model<IUser>("User", userSchema)

export default User;