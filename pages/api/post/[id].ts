// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { client } from '../../../src/utils/client'
import { postDetailQuery } from '../../../src/utils/queries'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        const { id } = req.query
        const query = postDetailQuery(id)

        const data = await client.fetch(query)

        res.status(200).json(data[0])
    }
}
