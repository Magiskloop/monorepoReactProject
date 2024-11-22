import React, { useEffect, useRef } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

type Props = {
    onChange?: (bool: boolean) => void
}
const tabs = [
    { name: '关注', to: '/follow' },
    { name: '推荐', to: '/' },
    { name: '热榜', to: '/hot' },
    { name: '视频', to: '/vedio' },

]
const Tabs = ({ onChange }: Props) => {

    // 当我们这个tabs 在屏幕中不显示的时候，进行切换
    // 如何判断?
    const scrollRef = useRef<HTMLDivElement>(null)
    // 1.getBoundClientRect()
    // 2.浏览器中的五个observer : IntersectionObserver(),performacnceObserver,mutationObserver,reportingObserver, resizeObserver

    useEffect(() => {
        let intersectionObserver: IntersectionObserver | undefined = new IntersectionObserver((entries) => {
            // console.log(entries[0].isIntersecting)
            onChange?.(entries[0].isIntersecting)
        })
        scrollRef.current && intersectionObserver.observe(scrollRef.current)
        return () => {
            scrollRef.current && intersectionObserver?.unobserve(scrollRef.current)
        }
    }, [])

    return (
        <div className='w-full'>
            <div ref={scrollRef}></div>
            <div className='flex mx-6 box-border'>
                {
                    tabs.map(item => <NavLink
                        key={item.name}
                        to={item.to}
                        className={({ isActive }) => 'whitespace-nowrap py-4 px-4 text-base transition-all ' + (isActive ? 'text-blue-600 font-bold' : 'text-black hover:text-blue-900')}>
                        {item.name}
                    </NavLink>)
                }
            </div>
            <Outlet />
        </div>
    )
}

export default Tabs