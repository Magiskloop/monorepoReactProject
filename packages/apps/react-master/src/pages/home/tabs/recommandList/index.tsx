import React, {
	FC,
	MouseEventHandler,
	RefObject,
	useEffect,
	useRef,
	useState,
} from "react";
import { mockList } from "./mockList";
import { sendLog } from "../../../../utils/lib/api";

interface Iprops {
	item: any;
}

const RecommendData: FC<Iprops> = ({ item }) => {
	const [selected, setSelected] = useState<boolean>(false);

	const handleClick: MouseEventHandler<Element> = (event) => {
		event?.preventDefault();
		setSelected((val) => !val);
	};

	useEffect(() => {
		sendLog({
			msg: item?.target?.question?.title || item?.target?.title,
		});
	});

	return (
		<div className="flex flex-col items-start p-4 border-b">
			{/* 标题 */}
			<div className="h-auto flex justify-start">
				<a
					className="font-bold text-black text-lg leading-10"
					target="_blank"
					href={`https://www.zhihu.com/question/${item?.target?.question?.id}/answer/${item?.target?.id}`}
				>
					{item?.target?.question?.title || item?.target?.title}
				</a>
			</div>
			{/* 内容 */}
			{selected ? (
				<div
					dangerouslySetInnerHTML={{ __html: item?.target?.content }}
				></div>
			) : (
				<a
					href="/"
					onClick={handleClick}
					className="cursor-pointer text-gray-800 hover:text-gray-500"
				>
					{item?.target?.excerpt}{" "}
					<span className="text-sm lending-7 text-blue-500 hover:text-gray-500">
						阅读全文
					</span>
				</a>
			)}
			{/* 底bar */}
			<div className="flex bg-white w-full">
				{selected && (
					<div
						onClick={handleClick}
						className="text-base text-gray-400 p-2 m-2 inline-flex cursor-pointer"
					>
						<span className="inline-flex">收起</span>
					</div>
				)}
			</div>
		</div>
	);
};

const fetchList = () =>
	new Promise<Array<any>>((reslove, reject) => {
		setTimeout(() => {
			reslove(mockList.slice(10, 20) as Array<any>);
		}, 300);
	});

type Props = {};

//#1 实现一个类useEffect类型的自定义hook
const useRefInsObsEffect = (
	fn: (b: boolean) => void,
	ref: RefObject<HTMLDivElement>,
) => {
	useEffect(() => {
		let intersectionObserver: IntersectionObserver | undefined =
			new IntersectionObserver((entries) => {
				// console.log(entries[0].isIntersecting)
				fn(entries[0]?.isIntersecting);
			});
		ref.current && intersectionObserver.observe(ref.current);
		return () => {
			ref.current && intersectionObserver?.unobserve(ref.current);
		};
	}, []);
};

//#2 实现一个类useState类型的自定义hook (const [state,dispath] = useState())
const useRefInsObsState = (ref: RefObject<HTMLDivElement>) => {
	const [list, setList] = useState<Array<any>>(mockList.slice(0, 10));
	useEffect(() => {
		let intersectionObserver: IntersectionObserver | undefined =
			new IntersectionObserver((entries) => {
				// console.log(entries[0].isIntersecting)
				entries[0]?.isIntersecting &&
					fetchList().then((res: Array<any>) => {
						setList((list) => [...list, ...res]);
					});
			});
		ref.current && intersectionObserver.observe(ref.current);
		return () => {
			ref.current && intersectionObserver?.unobserve(ref.current);
		};
	}, []);

	return list;
};

const RecommandList = (props: Props) => {
	//#2 const [list, setList] = useState<Array<any>>(mockList.slice(0, 10))

	const scrollRef = useRef<HTMLDivElement>(null);

	const list = useRefInsObsState(scrollRef);

	//#2 useRefInsObsEffect((b) => {
	//   b && fetchList().then((res: Array<any>) => {
	//     setList(list => [...list, ...res])
	//   })
	// }, scrollRef)

	//#1 useEffect(() => {
	//   let intersectionObserver: IntersectionObserver | undefined = new IntersectionObserver((entries) => {
	//     // console.log(entries[0].isIntersecting)
	//     entries[0]?.isIntersecting &&
	//   })
	//   scrollRef.current && intersectionObserver.observe(scrollRef.current)
	//   return () => {
	//     scrollRef.current && intersectionObserver?.unobserve(scrollRef.current)
	//   }
	// }, [])

	return (
		<div className="flex flex-col border-t">
			{list.map((item, idx) => (
				<RecommendData key={item?.id + idx} item={item} />
			))}
			{/* 只要这个div被显示了，说明滚动到底部了，需要再次请求 */}
			<div
				ref={scrollRef}
				className="flex h-14 justify-center items-center text-gray-500"
			>
				loading...
			</div>
		</div>
	);
};

export default RecommandList;
