import React, {
	ChangeEventHandler,
	FocusEventHandler,
	Fragment,
	KeyboardEventHandler,
	useEffect,
	useRef,
	useState,
} from "react";
import { localStore } from "../../utils/store";
import { filter } from "lodash-es";

type Props = {};

const Search = (props: Props) => {
	// state
	// 下拉框内的数据
	const [relatedList, setRelatedList] = useState<Array<string>>([]);
	// 当前选择的数据
	const [selectedIdx, setSelectedIdx] = useState<number>(-1);
	// input的内容
	const [inputValue, setInputValue] = useState<string>("");
	const [left, setLeft] = useState<string>("");

	//ref
	const inputRef = useRef<HTMLInputElement>(null);

	const __clearAll = () => {
		setSelectedIdx(-1);
		setRelatedList([]);
	};

	const handleFocus: FocusEventHandler<HTMLInputElement> | undefined = (
		e: React.FocusEvent<HTMLInputElement, Element>,
	) => {
		// 鼠标聚焦
		// 下拉框应是一个数组，并且有一定的存储功能

		setRelatedList(
			(
				localStore
					// @ts-ignore
					.get("historyArr") || []
			)
				.reduce(
					(total: Array<string>, item: string) =>
						total.find((i: string) => i === item)
							? total
							: [...total, item],
					[],
				)
				.filter((item: string) => Boolean(item))
				.filter(
					(item: string) =>
						!e.target.value ||
						(e.target.value && item.includes(e.target.value)),
				)
				.slice(0, 5),
		);
	};

	const handleBlur: FocusEventHandler<HTMLInputElement> = (e) => {
		// 鼠标失焦
		__clearAll();
	};

	const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
		setInputValue(e.target.value);
		handleFocus(e as React.FocusEvent<HTMLInputElement, Element>);
	};

	const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
		switch (e.key) {
			case "Enter": {
				// 回车
				const currentValue =
					selectedIdx !== -1 ? relatedList[selectedIdx] : inputValue;
				// 把数据放进输入框中
				setInputValue(currentValue);
				// 存储一下数据
				// @ts-ignore
				localStore.unshift("historyArr", currentValue);
				__clearAll();
				// 开始搜索
				break;
			}
			case "ArrowUp": {
				if (relatedList.length) {
					// 历史记录有内容
					if (selectedIdx !== 0 && selectedIdx !== -1) {
						setSelectedIdx((n) => n - 1);
					} else {
						setSelectedIdx(relatedList.length - 1);
					}
				}
				break;
			}
			case "ArrowDown": {
				if (relatedList.length) {
					// 历史记录有内容
					if (selectedIdx < relatedList.length - 1) {
						setSelectedIdx((n) => n + 1);
					} else {
						setSelectedIdx(0);
					}
				}
				break;
			}
		}
	};

	useEffect(() => {
		inputRef.current &&
			setLeft(`${inputRef?.current?.getBoundingClientRect()?.x}px`);
	}, [inputRef.current]);

	return (
		<Fragment>
			<div className="flex items-center ">
				<input
					className="w-96 h-8 border border-gray-100 px-4 rounded-full bg-gray-50"
					onBlur={handleBlur}
					onFocus={handleFocus}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					placeholder="最近前端行情"
					ref={inputRef}
					value={inputValue}
				/>
				<button className="w-16 h-8 mx-4 text-sm bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-all duration-300">
					提问
				</button>
			</div>
			{relatedList.length > 0 && (
				<div
					style={{
						left: left ? left : 0,
					}}
					className="fixed top-16 w-96 z-10 bg-white border-gray-200 rounded-md p-2 shadow-sm"
				>
					{relatedList.map((item, idx) => (
						<div
							key={item}
							className={`${idx === selectedIdx ? "text-blue-600 bg-gray-100" : "text-gray-800"} h-8 rounded-md px-2 flex items-center`}
						>
							{item}
						</div>
					))}
				</div>
			)}
		</Fragment>
	);
};

export default Search;
