import mongoose ,{Schema} from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const videoSchema=new Schema(
    {
        videoFile:{
            type:String, //CLOUDNARY URL
            required:true,
        },
        thumbnail:{
            type:String, //CLOUDNARY URL
            required:true
        },
        title:{
            type:String, 
            required:true
        },
        description:{
            type:String, 
            required:true
        },
        duration:{
            type:Number, //WILL GET DURATION FROM CLOUDNARY
            required:true
        },
        views:{
            type:Number, 
            default:0
        },
        isPublished:{
            type:Boolean,
            default:true,
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
        }
    },
    
    {timeStamps:true});

videoSchema.plugin(mongooseAggregatePaginate);
export const Video = mongoose.model('Video',videoSchema);