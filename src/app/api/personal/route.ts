import { NextResponse } from "next/server";
import { executeQuery } from '../../lib/connection';


export async function GET() {
    try {
        const personal = await executeQuery('SELECT * FROM operador');
        return NextResponse.json(personal);
    } catch (error) {
        console.error('❌ API Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
