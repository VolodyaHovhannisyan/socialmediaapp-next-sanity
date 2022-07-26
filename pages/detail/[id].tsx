import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { BsFillPlayFill } from 'react-icons/bs'
import { GoVerified } from 'react-icons/go'
import { HiVolumeOff, HiVolumeUp } from 'react-icons/hi'
import { MdOutlineCancel } from 'react-icons/md'
import Comments from '../../src/components/Comments'
import LikeButton from '../../src/components/LikeButton'
import useAuthStore from '../../src/store/authStore'
import { Video } from '../../src/types'
import { BASE_URL } from '../../src/utils'

interface IProps {
  postDetails: Video
}

const Detail = ({ postDetails }: IProps) => {
  const [post, setPost] = useState(postDetails)
  const [playing, setPlaying] = useState(false)
  const [isVideoMuted, setIsVideoMuted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()
  const { userProfile }: { userProfile: any } = useAuthStore()

  const onVideoClick = () => {
    if (playing) {
      videoRef?.current?.pause()
      setPlaying(false)
    } else {
      videoRef?.current?.play()
      setPlaying(true)
    }
  }

  const handleLike = async (like: boolean) => {
    if (userProfile) {
      const response = await axios.put(`${BASE_URL}/api/like`, {
        userId: userProfile._id,
        postId: post._id,
        like
      })
    }
  }

  return (
    <div className='flex h-full w-full absolute left-0 top-0 bg-white flex-wrap lg:flex-nowrap'>
      <div className="relative flex-2 w-[1000px] lg:w-9/12 flex justify-center items-center bg-pink-300">
        <div className="absolute top-6 left-2 lg:left-6 flex gap-6 z-50">
          <p className='cursor-pointer' onClick={() => router.back()}>
            <MdOutlineCancel className='text-white text-[35px]' />
          </p>
        </div>
        <div className="relative">
          <div className="lg:h-[100vh] h-[60vh]">
            <video
              src={post.video.asset.url}
              className='h-full cursor-pointer'
              ref={videoRef}
              loop
              onClick={onVideoClick}
              muted={isVideoMuted}
            >
            </video>
          </div>

          <div className='absolute top-[45%] left-[45%]'>
            {!playing && (
              <button onClick={onVideoClick}>
                <BsFillPlayFill className='text-white text-6xl lg:text-8xl' />
              </button>
            )}
          </div>
        </div>
        <div className='absolute bottom-5 lg:bottom-10 right-5 lg:right-10 cursor-pointer'>
          {isVideoMuted ? (
            <button onClick={() => setIsVideoMuted(false)}>
              <HiVolumeOff className="text-white text-2xl lg:text-4xl" />
            </button>
          ) : (
            <button onClick={() => setIsVideoMuted(true)}>
              <HiVolumeUp className="text-white text-2xl lg:text-4xl" />
            </button>
          )}
        </div>
      </div>
      <div className="relative w-[1000px] md:w-[900px] lg:w-[700px]">
        <div className="lg:mt-20 mt-10">

          <div className="flex gap-3 p-2 cursor-pointer font-semibold rounded">
            <div className=" ml-4 md:w-20 md:h-20 w-16 h-16">
              <Link href={"/"} >
                <>
                  <Image
                    width={62}
                    height={62}
                    src={post.postedBy.image}
                    alt="Profile photo"
                    layout="responsive"
                    className="rounded-full"
                  />
                </>
              </Link>
            </div>
            <Link href={"/"} >
              <div className="mt-3 flex flex-col gap-2 ">
                <p className="flex gap-2 items-center md:text-md font-bold text-primary" >{post.postedBy.userName}{''}
                  <GoVerified className="text-blue-400 text-md " />
                </p>
                <p className="capitalize font-medium text-xs text-gray-500 hidden md:block">{post.postedBy.userName}</p>
              </div>
            </Link>
          </div>
        </div>

        <p className='px-10 text-lg text-gray-600'>{post.caption}</p>

        <div className="mt-10 px-10">
          {userProfile && <LikeButton
              handleLike={() => handleLike(true)}
              handleDislike={() => handleLike(false)}
          />}
        </div>
        <Comments />
      </div>
    </div>
  )
}

export const getServerSideProps = async ({ params: { id } }: { params: { id: string } }) => {
  const { data } = await axios.get(`${BASE_URL}/api/post/${id}`)

  return {
    props: {
      postDetails: data
    }
  }
}

export default Detail