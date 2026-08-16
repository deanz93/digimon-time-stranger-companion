import {NextRequest,NextResponse} from 'next/server';
import {staticApiGet} from '../../../lib/staticData';

export const dynamic='force-dynamic';
export async function GET(request:NextRequest,{params}:{params:Promise<{path:string[]}>}){const{path}=await params;const value=staticApiGet(`/${path.join('/')}${request.nextUrl.search}`);return value==null?NextResponse.json({message:'Not found'},{status:404}):NextResponse.json(value)}
export async function POST(){return NextResponse.json({message:'Cloud accounts require a hosted database and are not enabled on this deployment.'},{status:503})}
export const PUT=POST;
export const DELETE=POST;
