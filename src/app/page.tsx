'use client';

import { signIn, signOut, useSession } from "next-auth/react";
import Script from "next/script";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    Kakao: typeof Kakao;
  }
}


export default function Home() {
  const {data: session} = useSession();
  const [userInfo, setUserInfo] = useState<any>();

  const getDatabase = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notion/db`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log(await response.json());
  }

  useEffect(() => {
    getDatabase();
  }, [])

  useEffect(() => {
    setUserInfo(() => session?.user)
    window.Kakao?.Auth.setAccessToken(session!.user!.accessToken);
  },[session])
  
  const selectFriends = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_KAKAO_V1_BASE_API}/talk/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.accessToken}`
        }
      })
  
      console.log(response.json());
    } catch (err) {
      console.error(err);
    }
  }

  const selfMessageSend = async () => {
    try {
      
      const template_object = {
        "object_type":"text",
        "text":"카톡 메세지 보내보기",
        "link": {
          "web_url":"https://naver.com"
        }
      }
      const formBody = [];
      
        const encodedKey = encodeURIComponent('template_object');
        const encodedValue = encodeURIComponent(JSON.stringify({
          "object_type":"text",
          "text":"카톡 메세지 보내보기",
          "link": {
            "web_url":"https://naver.com"
          }
        }));
        formBody.push(`${encodedKey}=${encodedValue}`);
        
      const response = await fetch(`${process.env.NEXT_PUBLIC_KAKAO_V2_BASE_API}/talk/memo/default/send`, {
        method: 'POST',
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${userInfo.accessToken}`
        },
        body: formBody.join('&')
      })
      console.log(response);
    } catch(err) {
      console.error(err);
    }
  }
  if(session && session.user) {
    return (
      <div>
        <button type='button' onClick={() => signOut()}> 로그아웃</button>
        <button type="button" onClick={selectFriends}>친구 목록 조회</button>
        <button type="button" onClick={selfMessageSend}>셀프 메세지 보내기</button>
      </div>
    )
  }

  return (
    <div>
      <button type="button" onClick={() => signIn('kakao')}>카카오 로그인</button>
    </div>
  )
  
}
