'use client'
import React, { useState, useEffect } from 'react'
import { FaPen } from 'react-icons/fa'

interface TeamMember {
  id: number
  name: string
  studentId: string
  department: string
  introduction: string
  github: string
  vercel: string
  portpolio: string
  image: string
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: '고은이',
    studentId: '92313271',
    department: '정보보호학과',
    introduction:
      '안녕하세요. 23학번 2학년 고은이입니다. 웹 서버 보안 프로그래밍 수업을 통해 nextjs에 대해 배우고  웹 서비스를 제공하는 웹 사이트를 제작하는 것을 배우고 있습니다. 웹 이외에는 포렌식에 관심을 가지고 공부하고 있습니다.',
    github: 'https://github.com/goeuni',
    vercel: 'https://vercel.com/goeunis-projects',
    portpolio: 'https://portfolio-goeunis-projects.vercel.app/', //
    image: '/img1.jpg',
  },
  {
    id: 2,
    name: '이지훈',
    studentId: '92113774',
    department: '정보보호학과',
    introduction:
      '1학기에 기초적인 웹 프로그래밍에 대해 배우고 2학기에 백엔드 프로그래밍과 Next.js 활용법에 대해 배우고 싶어  웹서버 보안 프로그래밍 과목을 수강하게 된 21학번 이지훈입니다. 웹 서버 보안 이외에도 리버스 엔지니어링 등에 관심을 갖고 있습니다.',
    github: 'https://github.com/Hoodscp',
    vercel: 'https://Hoodscp.vercel.app',
    portpolio: 'https://my-playground-livid.vercel.app/',
    image: '/img2.jpg',
  },
  {
    id: 3,
    name: '전성배',
    studentId: '92451097',
    department: '정보보호학과',
    introduction:
      '24학번으로 정보보호학과에 편입한 3학년 전성배입니다. 개발자와 보안 두 분야 모두 웹의 개발과정, 작동원리를 알아야 더 좋은 개발자가 될 수 있다는 이병천 교수님의 말씀대로 웹 서버 보안 프로그래밍을 수강하고 있습니다.',
    github: 'https://github.com/sung0125',
    vercel: 'https://vercel.com/sungbae-jeons-projects',
    portpolio: 'https://jb-next-js.vercel.app/',
    image: '/img3.jpg',
  },
  {
    id: 4,
    name: '홍정현',
    studentId: '92313726',
    department: '정보보호학과',
    introduction:
      '정보보호학과에 재학 중인 23학번 홍정현입니다. 웹 서버 보안 프로그래밍 과목을 통해 기초적인 웹 프로그래밍을 배우고 있으며, 2학기 때는 특히 백엔드 분야에 집중해 수강하고 있습니다.',
    github: 'https://github.com/anon418',
    vercel: 'https://vercel.com/anondzs-projects',
    portpolio: 'https://int-dusky.vercel.app/',
    image: '/img4.jpg',
  },
]

interface MemberCardProps {
  member: TeamMember
  index: number // index의 타입을 number로 지정
}

const MemberCard: React.FC<MemberCardProps> = ({ member, index }) => {
  const [isVisible, setIsVisible] = useState(false)
  //const [showGithub, setShowGithub] = useState(false)
  const [showLinks, setShowLinks] = useState(false) // 링크 표시 상태 추가

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 200)
    return () => clearTimeout(timer)
  }, [index])

  return (
    <div
      className={`relative bg-white p-8 rounded-lg shadow-md transition-all duration-500 ease-in-out transform ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      } w-full h-[300px] mb-4`} // 박스 크기 조정
    >
      <div className="flex items-start mb-4">
        <img
          src={member.image}
          alt={member.name}
          className="w-24 h-24 rounded-full mr-4 -mt-10 -ml-10 border-4 border-white cursor-pointer hover:brightness-50" // 사진 클릭 시 원본 보기
          onClick={() => window.open(member.image, '_blank')} // 사진 클릭 시 새 창에서 원본 열기
        />
        <div>
          <h3 className="text-2xl font-bold">{member.name}</h3>{' '}
          <p className="text-gray-600 text-lg">{member.studentId}</p>{' '}
          <p className="text-gray-600 text-lg">{member.department}</p>{' '}
        </div>
      </div>
      <p className="text-gray-800 text-lg mb-4">{member.introduction}</p>{' '}
      <div
        className="flex items-center text-sky-200 cursor-pointer hover:text-gray-300"
        onClick={() => setShowLinks(!showLinks)} // 클릭 시 링크 표시/숨김
      >
        <FaPen size={20} className="mr-2" />
        <span className="text-lg">Address</span>
      </div>
      {showLinks && (
        <div className="absolute bottom-2 left-6 bg-sky-200 p-2 rounded">
          <a
            href={member.github}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-black mb-1"
          >
            GitHub: {member.github}
          </a>
          <a
            href={member.vercel}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-black mb-1"
          >
            Vercel: {member.vercel}
          </a>
          <a
            href={member.portpolio}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-black"
          >
            Portpolio: {member.portpolio}
          </a>
        </div>
      )}
    </div>
  )
}

const TeamIntroduction = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-4xl font-bold text-center mb-8">팀원 소개</h2>{' '}
      <div className="flex flex-col space-y-4">
        {' '}
        {/* 수직 배치 및 간격 설정 */}
        {teamMembers.map((member, index) => (
          <MemberCard key={member.id} member={member} index={index} />
        ))}
      </div>
    </div>
  )
}

export default TeamIntroduction
