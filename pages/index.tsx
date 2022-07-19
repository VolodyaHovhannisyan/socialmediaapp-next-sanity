import axios from 'axios'
import type { NextPage } from 'next'
import NoResults from '../src/components/NoResults';
import VideoCard from '../src/components/VideoCard';
import { Video } from '../src/types';

interface IProps {
  videos: Video[]
}

const Home = ({videos}: IProps) => {
  console.log(videos);
  
  return (
    <div className="flex flex-col gap-10 videos h-full">
      {videos.length ? (
        videos.map((video: Video) => (
          <VideoCard post={video} key={video._id} />
        ))
      ): <NoResults text={'No Videos'} />}
    </div>
  )
}

export const getServerSideProps = async () => {
  const {data} = await axios.get(`http://localhost:3000/api/post`)
  
  return {
    props: {
      videos: data
    }
  }
}

export default Home
