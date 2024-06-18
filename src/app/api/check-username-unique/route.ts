import dbConnect from "@/lib/dbConnect";
import {usernameValidation} from '@/schemas/signUpSchema';
import {z} from 'zod';
import UserModel from "@/model/User";


const UsernameQuerySchema = z.object({
    username:usernameValidation
});

export async function GET(req:Request) {
    await dbConnect();

    try {
        const {searchParams} = new URL(req.url);
        const queryParams = {
            username:searchParams.get('username')
        }
        const result = UsernameQuerySchema.safeParse(queryParams);
        console.log("Result: ",result);

        if(!result.success){
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json({
                success:false,
                message:usernameErrors?.length > 0 ? usernameErrors.join(', ') : 'Invalid query parameters',
            },
            {
            status:400
            })
        }

        const {username} = result.data;

        const existingVerifiedUser = await UserModel.findOne({username,isVerified:true});

        if(existingVerifiedUser){
            return Response.json({
                success:false,
                message:'User name already taken'
            },{
                status:400
            });
        }
        else{
            return Response.json({
                success:true,
                message:'Username available'
            },{
                status:200
            });
        }
    } catch (error) {
        console.error('Error checking username',error);
        return Response.json({
            success:false,
            message:"Error checking username"
        },
        {
            status:500
        });
    }
}