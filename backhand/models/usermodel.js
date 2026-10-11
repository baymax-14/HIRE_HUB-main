import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
     email:{
        type:String,
        required:true,
        unique:true
    },
     phoneNumber:{
        type:String,
        required:false,
        default:""
    },
     password:{
        type:String,
        required:false,
        default:""
    },
    authProvider:{
        type:String,
        enum:['local', 'google', 'github'],
        default:'local'
    },
    googleId:{
        type:String,
        default:""
    },
    githubId:{
        type:String,
        default:""
    },
    role: {
         type: String,
         enum: ['student', 'recruiter'],
         required: true
         },

    profile:{
        bio:{
            type:String
        },
        skills:[{type:String}],
        resume:{
            type:String
        },
        resumeOriginalName:{
            type:String
        },
        company:{
            type:mongoose.Schema.Types.ObjectId, // generate a relation
            ref:'Company' //it refersence to comoany model
        },
        profilephoto:{
            type:"String",
            default:""
        },
        emailNotifications:{
            type: Boolean,
            default: true
        }
    },
    savedJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }]
},{timestamps:true});

export const User = mongoose.model('User',userSchema);