import dbConnect from "@/lib/dbConnect";
import {verifySchema} from '@/schemas/verifySchema';
import {z} from 'zod';
import UserModel from "@/model/User";



export async function POST(req:Request) {
    
    await dbConnect();

    try {
        const {code,username} = await req.json();
        const result  = verifySchema.safeParse({code});
        if(!result.success){
            console.log('Validation Failed');
            const verifyCodeErrors = result.error.format().code?._errors || [];
            
            return Response.json({
                success:false,
                message:verifyCodeErrors?.length > 0 ? verifyCodeErrors.join(', ') : 'Invalid request body',
            },
            {
            status:400
            });

        }
        
        const verifyCode = result.data.code;
        const user = await UserModel.findOne({username});

        if(!user){
            return Response.json({
                success:false,
                message:'User not found'
            },{status:400});
        }

        const isCodeValid = user.verifyCode === verifyCode;
       
        const isCodeNotExpired = new Date() < new Date(user.verifyCodeExpiry);
       
        if(isCodeValid && isCodeNotExpired){

            user.isVerified = true;
            await user.save();

            return Response.json({
                success:true,
                message:"User verified successfully"
            },{
                status:200
            });

        }else if(!isCodeNotExpired){

            return Response.json({
                success:false,
                messsage:"Code expired, sign up again."
            },{
                status:400
            });

        }else{

            return Response.json({
                success:false,
                message:"Incorrect verification code."
            },{
                status:400
            });
        }
        
    } catch (error) {

        console.log('Error in verifing the user');
        return Response.json({
            success:false,
            message:'Could not verify the user'
        },{
            status:500
        });

    }
}